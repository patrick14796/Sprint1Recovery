
$(document).ready(function() {
function D3(svg) {
    const self = {
        html: document.querySelector(svg),
        append: shape => {
            let created = self.html.appendChild(document.createElementNS("http://www.w3.org/2000/svg", shape));
            const layout = {
                x: number=>{created.setAttribute("x", number); return layout},
                y: number => { created.setAttribute("y", number); return layout },
                x1: number=>{created.setAttribute("x1", number); return layout},
                y1: number=>{created.setAttribute("y1", number); return layout},
                x2: number=>{created.setAttribute("x2", number); return layout},
                y2: number=>{created.setAttribute("y2", number); return layout},
                r: number=>{created.setAttribute("r", number); return layout},
                cx: number=>{created.setAttribute("cx", number); return layout},
                cy: number=>{created.setAttribute("cy", number); return layout},
                points: points=>{created.setAttribute("points", points); return layout},
                height: number=>{created.setAttribute("height", number+"px"); return layout},
                width: number=>{created.setAttribute("width", number+"px"); return layout},
                fill: color=>{created.setAttribute("fill", color); return layout},
                stroke: color=>{created.setAttribute("stroke", color); return layout},
                strokeWidth: number => { created.setAttribute("stroke-width", number + "px"); return layout },
                text: text => { created.innerHTML = text; return layout },
                hover: callBack => { created.addEventListener("mouseover", callBack); return layout },
                attr: (Name, value = "") => { created.setAttribute(Name, value); return layout},
                append: shape => {
                    let create = created.appendChild(document.createElementNS("http://www.w3.org/2000/svg", shape)),
                        added = {
                            x: number => { create.setAttribute("x", number); return added },
                            y: number => { create.setAttribute("y", number); return added },
                            rx: number=>{create.setAttribute("rx", number); return added},
                            attr: (Name, value = "") => { create.setAttribute(Name, value); return added},
                            width: number => { create.setAttribute("width", number + "px"); return added },
                            height: number => { create.setAttribute("height", number + "px"); return added },
                            fill: color => { create.setAttribute("fill", color); return added },
                            stroke: color => { create.setAttribute("stroke", color); return added },
                            strokeWidth: number => { create.setAttribute("stroke-width", number + "px"); return added },
                            text: text => { create.innerHTML = text; return added },
                            append: shape => { return layout.append(shape) }
                        };
                    return added
                },
                exit: _=>{return self}
            }
            return layout
        },
        viewBox: value => { self.html.setAttribute("viewBox", value); return self },
    }
    return self
}



let data = { "data1": 2, "data2": 10, "data3": 5, "data4": 3, "data5": 6, "data6": 8, "data7": 7,"data8":11,"data9": 13,"data10":8},
w = 600,
h = 300,
x_space = 20,
values = Object.values(data),
keys = Object.keys(data),
max = Math.max(...values),
min = Math.min(...values),
title = "payment";

if (max < 10) {
x_space = 20
} else if (max < 100) {
x_space = 25
} else if (max < 1000) {
x_space = 30
} else if (max < 10000) {
x_space = 40
} else if (max < 100000) {
x_space = 45
} else if (max < 1000000) {
x_space = 50
}else if (max < 10000000) {
x_space = 55
}else if (max < 100000000) {
x_space = 65
}else if (max < 1000000000) {
x_space = 70
}

let step = Math.round(((max - min) / values.length)),
row = (h-30)/(values.length+2),
coulmn = ((w-(x_space-40))/values.length)-3,
text = min,
y= 40,
x = x_space+10,
x2 = x_space+10,
x3 = x_space+10,
one_unit = (h - 30) / (max),
points = "",
color = ["#e4e4e433","#e4e4e433","#53a2d7"];

D3("svg#line")
.viewBox(`0 0 ${w} ${h}`)
.append("line")
    .x1(x_space)
    .y1(1)
    .x2(x_space)
    .y2(h-30)
    .stroke(color[0])
.exit()
.append("line")
    .x1(x_space)
    .y1(h-30)
    .x2(w-0)
    .y2(h-30)
    .stroke(color[0])

while (text<(max+step)) {
D3("svg#line")
    .append("text")
        .x(5)
        .y((h-y)-2)
        .text(text)
        .fill("#999")
    .exit()
        .append("line")
        .x1(x_space)
        .y1((h-y)-6)
        .x2(w)
        .y2((h-y)-6)
        .stroke(color[1])
    y+= row
    text+= step
}
for (let n in keys) {
D3("svg#line")
    .append("text")
        .x(x)
        .y(h-15)
        .text(keys[n])
        .fill("#999")
    x+= coulmn
}
for (let v in values) {
let y3 = 40,
    data = min;
while(data < values[v]){
    y3 += 1
    data+= (step/row)
}
points += `${x2+10},${h-(y3+6)} `
x2 += coulmn
}
D3("svg#line")
.append("polyline")
    .points(points)
    .fill("none")
    .stroke(color[2])
    .strokeWidth(1)

for (let v in values) {
let y3 = 40,
    data = min;
while(data < values[v]){
    y3 += 1
    data+= (step/row)
}
D3("svg#line")
    .append("circle")
        .cx(x3+10)
        .cy(h-(y3+6))
        .r(3)
        .fill(color[2])
        .attr("animetion")
        .attr("unique",v)
        .exit()
        .append("circle")
            .cx(x3+10)
            .cy(h-(y3+6))
            .r(20)
            .attr("hovering")
            .attr("data-value",values[v])
            .attr("data-key",keys[v])
            .attr("unique",v)
            .fill("#fff0")
x3 += coulmn
}
for (let circle of document.querySelectorAll("svg circle[hovering]")) {
let g_x = circle.getAttribute("cx")*1 + 5,
    g_y = circle.getAttribute("cy") - 45,
    g_h = 40,g_w=100;
if (g_y - g_h < 0) {
    g_y = g_y + g_h
}
if (g_x+g_w > w) {
    g_x = g_x-g_w
}
circle.addEventListener("mouseover", _ => {
    D3("svg#line")
        .append("g")
            .attr("style","font-size: 10px;fill: #fff;")
            .width(g_w)
            .attr("unique",circle.getAttribute("unique"))
            .attr("show_data","")
            .append("rect")
                .x(g_x)
                .y(g_y)
                .width(g_w)
                .height(g_h)
                .fill("#000000d9")
                .rx(5)
                .append("text")
                    .x(g_x+5)
                    .y(g_y+15)
                    .text(circle.getAttribute("data-key"))
                    .attr("style","font-weight: bold;")
                .append("text")
                    .x(g_x+5)
                    .y(g_y+30)
                    .text(`${title}: ${circle.getAttribute("data-value")} EGP`)
    document.querySelector(`circle[animetion][unique="${circle.getAttribute("unique")}"]`).setAttribute("start","")
})
circle.addEventListener("mouseout", _ => {
    document.querySelector(`svg g[unique="${circle.getAttribute("unique")}"]`).remove()
    document.querySelector(`circle[animetion][unique="${circle.getAttribute("unique")}"]`).removeAttribute("start")
})
}
});