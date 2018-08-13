export const registration = (user) => {
	debugger;
	return (
		$.ajax({
			url: '/registration',
			method: 'POST',
			data: user
		})
	);
};

export const login = (user) => (
	$.ajax({
		url: '/login',
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

