import { isEmailInUse, insertUser, getUsers } from '../../queries/user.js'

const validateUser = async (user) => {

	const res = {
		valid: true,
		messages: []
	};

	if(!user.email?.match(/(\w+)@(\w+\.\w+)/)) {
		res.valid = false;
		res.messages.push({'email': 'Email format not valid'});
	}

	if(user.email.length >= 75) {
		res.valid = false;
		res.messages.push({'email': 'Email is too long'});
	}

	if(!user.password?.match(/\S{5,}/)) {
		res.valid = false;
		res.messages.push({'password': 'Password is too short'});
	}

	if(!res.valid) return res;

	if(await isEmailInUse(user.email)) {
		res.valid = false;
		res.messages.push({'email': 'Email address is already in use'});
	}

	return res;
}

export default async (req, res) => {

	switch(req.method) {
		case 'POST':
			const val = await validateUser(req.body);
			if(val.valid) {
				res.status(201).json(await insertUser(req.body));
			} else {
				res.status(400).json({ errors: val.messages });
			}
			break;
		case 'GET':
			console.info(await getUsers(req.query));
			res.status(200).json(await getUsers(req.query));
			break;
	}
};