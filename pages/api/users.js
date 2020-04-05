import { isEmailInUse, insertUser } from './scripts/user.js'

const validateUser = async (user) => {

	const res = {
		valid: true,
		messages: []
	};

	if(!user.email?.match(/(\w+)@(\w+\.\w+)/)) {
		res.valid = false;
		res.messages.push('Email format not valid');
	}

	if(user.email.length >= 75) {
		res.valid = false;
		res.messages.push('Email is too long');
	}

	if(!user.password?.match(/\S{5,}/)) {
		res.valid = false;
		res.messages.push('Password is too short');
	}

	if(!res.valid) return res;

	if(await isEmailInUse(user.email)) {
		res.valid = false;
		res.messages.push('Email address is already used');
	}

	return res;
}

export default async (req, res) => {

	switch(req.method) {
		case 'POST':
			const val = await validateUser(req.body);
			if(val.valid) {
				await insertUser(req.body);
				res.status(201).json({});
			} else {
				res.status(400).json({ errors: val.messages });
			}
	}
};