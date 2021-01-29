// @packages
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @scripts
const User = require('../models/user');
const awsUploadImage = require('../utils/aws-upload-image');
require('dotenv').config({ path: '.env' });

const createToken = (user, SECRET_KEY, expiresIn) => {
    const { id, email, name, userName } = user;

    return jwt.sign({ id, email, name, userName }, SECRET_KEY, { expiresIn });
};

// Queries
const getUser = async (id, userName) => {
    let user = null;

    if (id) user = await User.findById(id);

    if (userName) user = await User.findOne({ userName });

    if (!user) throw new Error('El usuario no existe');

    return user;
};

// Mutations
const register = async (input) => {
    const {
        email,
        password,
        userName
    } = input;

    const mailExists = await User.findOne({ email: email.toLowerCase() });
    if (mailExists) throw new Error('El correo ya esta registrado');

    const userExists = await User.findOne({ userName: userName.toLowerCase() });
    if (userExists) throw new Error('El usuario ya esta siendo usado');

    const salt = await bcryptjs.genSaltSync(10);
    input.password = await bcryptjs.hash(password, salt);

    try {
        const user = new User(input);
        user.save();
        return user;
    } catch (error) {
        console.log(error);
    }
};

const login = async (input) => {
    const { email, password } = input;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (!userExists) throw new Error('Error en el email o contraseña');

    const passwordSucess = await bcryptjs.compare(password, userExists.password);
    if (!passwordSucess) throw new Error('Error en el email o contraseña');

    return {
        token: createToken(userExists, process.env.SECRET_KEY, '72h')
    }
};

const updateAvatar = async (file, ctx) => {
    const { createReadStream, mimetype } = await file;
    const extension = mimetype.split("/")[1];
    const imageName = `avatar/${ctx.user.id}.${extension}`;
    const fileData = createReadStream();

    try {
        const result = await awsUploadImage(fileData, imageName);

        await User.findByIdAndUpdate(ctx.user.id, { avatar: result });

        return {
            status: true,
            url: result
        };
    } catch (error) {
        return {
            status: false,
            urlAvatar: null
        };
    }
};

const deleteAvatar = async ({ user: { id } }) => {
    try {
        await User.findByIdAndUpdate(id, { avatar: '' });

        return true;
    } catch (error) {
        console.log(error);

        return false;
    }
};

const updateUser = async (input, ctx) => {
    const { currentPassword, newPassword } = input;

    const { user: { id } } = ctx;

    try {
        if (newPassword || currentPassword) {
            const userFound = await User.findById(id);
            const passwordSucess = await bcryptjs.compare(currentPassword, userFound.password);

            if (!passwordSucess) throw new Error('La contraseña actual es incorrecta');

            const salt = await bcryptjs.genSaltSync(10);
            const newPasswordCrypt = await bcryptjs.hash(newPassword, salt);

            await User.findByIdAndUpdate(id, { password: newPasswordCrypt });
        } else {
            await User.findByIdAndUpdate(id, input);
        }

        return true;
    } catch (error) {
        return false;
    }
};

const search = async (search) => {
    const users = await User.find({ name: { $regex: search, $options: 'i' } });

    return users;
};

module.exports = {
    deleteAvatar,
    getUser,
    login,
    register,
    search,
    updateAvatar,
    updateUser
};