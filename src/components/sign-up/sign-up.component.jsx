import {useState, useContext } from 'react';

import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase/firebase.utils';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';

import { UserContext } from '../../contexts/user.context';

import './sign-up.styles.scss';

const defaultformFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}
const SignUpForm = () => {

    const [formFields, setFormFields] = useState(defaultformFields)
    const { displayName, email, password, confirmPassword } = formFields;

    const { setCurrentUser } = useContext(UserContext)


    const resetFormFields = () => {
        setFormFields(defaultformFields)
    }

    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormFields({...formFields, [name]: value})

    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(password!==confirmPassword) {
            alert('Passwords do not match')
            return;
        } if (password.length < 6 ) {
            alert('Password must be at least 6 characters')
            return;
        }

        try {
            const { user } = await createAuthUserWithEmailAndPassword(email, password);
            setCurrentUser(user);
            await createUserDocumentFromAuth(user, { displayName });    
            resetFormFields();


        } catch (error) {
            if(error.code==='auth/email-already-in-use') {
                alert('Email already registered')
            }
            console.log('User creation encountered an error', error)
        }
    }

    return(
        <div className='sign-up-container'>
            <h2>Don't have an account?</h2>
            <span>Sign up with email and password</span>
           <form onSubmit={handleSubmit}>
            <FormInput label="Display Name" type="text" required onChange={handleChange} name='displayName' value={displayName}/>

            <FormInput label="Email" type="email" required onChange={handleChange} name='email' value={email}/>

            <FormInput label="Password" type="password" required onChange={handleChange} name='password' value={password}/>

            <FormInput label="Confirm password" type="password" required onChange={handleChange} name='confirmPassword' value={confirmPassword}/>
            <Button type="submit"> Sign up </Button>
           </form>
        </div>
    )
}

export default SignUpForm