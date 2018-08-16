export const sendEmail = (token, formData) => {
	return(
		$.ajax({
			url: 'http://localhost:8999/send_email',
			method: 'POST',
			
			data: formData,
			processData: false,
      contentType: false,
			beforeSend: (xhr) => {
				xhr.setRequestHeader('Authorization', `Bearer ${token}`);
			}
		})
	);
}