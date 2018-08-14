export const fetchAllImgs = (token) => (
	$.ajax({
		url: 'http://0.0.0.0:8999/syntax',
		method: 'POST',
		beforeSend: (xhr) => {
			xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		}
	})
);