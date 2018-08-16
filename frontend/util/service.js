export const sendService = (requestData) => (
	$.ajax({
    type: "POST",
    url: "http://ec2-54-214-224-99.us-west-2.compute.amazonaws.com:8888/n3n/snow/tasks",
    data : JSON.stringify(requestData),
    dataType: 'html',
    // success: function (data){
    //     var obj = JSON.parse(data);
    //     console.log(obj.records[0].number);
    //     alert("Incident Number ====>"+obj.records[0].number);
  })
);