export const getUserList = () => (
	$.ajax({
		url: 'http://localhost:8999/userlist',
		method: 'GET',
	});
);