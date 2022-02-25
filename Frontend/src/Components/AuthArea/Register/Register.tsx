import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import UserModel from "../../../Models/UserModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Register.css";

function Register(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<UserModel>({
        mode: 'onBlur'   // Validation will trigger on the change event with each input
    });
    const navigator = useNavigate();

    // check whether the use is in DB
    async function checkUsername(username: string): Promise<boolean> {
        try {
            // count how many times this user is in DB
            const count = await authService.checkUsername(username);
            if (count > 0) return false;
            if (count === 0) return true;
        } catch(err: any) {
            alert(err.message)
        }
    }

    async function submit(user: UserModel) {
        try {
            await authService.register(user);
            notifyService.success(`You are registered`);;
            navigator("/home");
        } catch(err: any) {
            alert(err.message);
        }
    }

    return (
        <div className="Register Box">

            <h2>Register</h2>

            <form onSubmit={handleSubmit(submit)}>

                <label>First name:</label>
                <input type="text" {...register("firstName",  {
                    required:  "Missing first name",
                    minLength: { value: 2, message: "First name must be minimum 2 chars" },
                    maxLength: { value: 20, message: "First name can't exceed 20 chars" },
                    pattern: { value: /^[A-Z]/, message: "Must starts with a capital letter" }
                })}/>
                <span>{formState.errors.firstName?.message}</span>

                <label>Last name:</label>
                <input type="text" {...register("lastName",  {
                    required:  "Missing last name",
                    minLength: { value: 2, message: "Last name must be minimum 2 chars" },
                    maxLength: { value: 20, message: "Last name can't exceed 20 chars" },
                    pattern: { value: /^[A-Z]/, message: "Must starts with a capital letter" }
                })}/>
                <span>{formState.errors.lastName?.message}</span>

                <label>Username:</label>
                <input type="text" {...register("username",  {
                    required:  "Missing username",
                    minLength: { value: 8, message: "Userame must be minimum 8 chars" },
                    maxLength: { value: 20, message: "Userame can't exceed 20 chars" },
                    validate: { value: async username => await checkUsername(username) === true  || "Username is taken. Choose another" },
                })}/>
                <span>{formState.errors.username?.message}</span>

                <label>Password:</label>
                <input type="password" {...register("password",  {
                    required:  "Missing password",
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 
                                message: 'Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character' }
                })}/>
                <span>{formState.errors.password?.message}</span>


                <button>Register</button>

            </form>
			
        </div>
    );
}

export default Register;
