export const getUserList = (token) => (
	$.ajax({
		url: 'http://localhost:8999/users',
		method: 'GET',
		beforeSend: (xhr) => {
			xhr.setRequestHeader('Authorization', `Bearer ${token}`);
		}
	})
);