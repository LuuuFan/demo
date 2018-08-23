export const sendService = (data, token) => {
    return(
        $.ajax({
        url: 'http://localhost:8999/snow/incident',
        method: 'POST',
        contentType: 'application/json',
        data : JSON.stringify(data),
        // data : data,
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      })
    );
};
    // success: function (data){
    //     var obj = JSON.parse(data);
    //     console.log(obj.records[0].number);
    //     alert("Incident Number ====>"+obj.records[0].number);
    // url: "http://ec2-54-214-224-99.us-west-2.compute.amazonaws.com:8888/n3n/snow/tasks",
    // dataType: 'html',