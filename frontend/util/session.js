
export const registration = (user) => {
	return (
		$.ajax({
			url: 'http://localhost:8999/registration',
			method: 'POST',
			data: user
		})
	);
};

export const login = (user) => (
	$.ajax({
		url: 'http://localhost:8999/login',
		method: 'POST',
		data: user
	})
);

// export const logout = () => (
// 	$.ajax({
// 		url: '/logout',
// 		method: 'POST'
// 	})
// );

