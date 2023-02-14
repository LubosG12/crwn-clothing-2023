import {useState, useContext} from 'react';

import FormInput from "../form-input/form-input.component"
import Button from '../button/button.component';
import { signInWithGooglePopup, createUserDocumentFromAuth, signInAuthUserWithEmailAndPassword } from "../../utils/firebase/firebase.utils";

import { UserContext } from '../../contexts/user.context';

import './sign-in.styles.scss'

const defaultformFields = {
    email: '',
    password: '',
}



const SignInForm = () => {

    const [formFields, setFormFields] = useState(defaultformFields)
    const { email, password } = formFields;

    const { setCurrentUser } = useContext(UserContext)

    const resetFormFields = () => {
        setFormFields(defaultformFields)
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormFields({...formFields, [name]: value})
    
    }

    const signInWithGoogle= async () => {
        const {user}= await signInWithGooglePopup();
        await createUserDocumentFromAuth(user)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
           const {user} = await signInAuthUserWithEmailAndPassword(email, password)
           setCurrentUser(user)
           resetFormFields();
        } catch (error) {
            switch(error.code) {
                case 'auth/wrong-password': alert('Incorrect password for user')
                    break
                case 'auth/user-not-found': alert('Email not registered')
                    break
                default:
                    console.log(error);

            }
        }
    }

    return(
        <div className='sign-up-container'>
           <h2>Already have an account?</h2> 
           <span>Sign in with email and password or Google</span>
            <form onSubmit={handleSubmit}>
                <FormInput label="Email" type="email" required onChange={handleChange} name='email' value={email}/>
                <FormInput label="Password" type="password" required onChange={handleChange} name='password' value={password}/>
                <div className='buttons-container'>
                <Button type="submit"> Sign in </Button>
                <Button type='button' onclick={signInWithGoogle} buttonType='google' > Google sign in </Button>
                </div>
            </form>
        </div>
    )
}

export default SignInForm;