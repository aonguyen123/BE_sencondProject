const bcrypt = require('bcryptjs');

const hashPassword = async password => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);
	return hash;
}

const comparePassword = async (oldPassword, newPassword) => {
	let rs = true;
	const isMatch = await bcrypt.compare(newPassword, oldPassword);
	if(!isMatch)
	{
		rs = false;
	}
	return rs;
}

module.exports = {
	hashPassword,
	comparePassword
}
