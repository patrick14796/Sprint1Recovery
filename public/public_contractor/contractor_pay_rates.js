$(document).ready(function() {
    $.get("/get_data_payrate",function(data){
        first_name=data.details[0].first_name
        last_name=data.details[0]. last_name
        workDays=data.details[0].ratings.length
        totalPay = () =>{
            let sum=0;
            for(let i=0;i<workDays;++i){
                sum+=parseInt(data.details[0].ratings[i][1])
            }
            return sum
        }
        averagePay  = () =>{
            let sum=0;
            for(let i=0;i<workDays;++i){
                sum+=parseInt(data.details[0].ratings[i][1])
            }
            return sum/workDays
        }
      $("#WorkDays").text(workDays)
      $("#TotalPay").text(totalPay)
      $("#AveragePay").text(averagePay)
      })
    });