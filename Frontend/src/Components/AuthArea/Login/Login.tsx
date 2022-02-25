import { useForm } from "react-hook-form";
import { useNavigate  } from "react-router-dom";
import CredentialsModel from "../../../Models/CredentialsModel";
import authService from "../../../Services/AuthService";
import notifyService from "../../../Services/NotifyService";
import "./Login.css";

function Login(): JSX.Element {

    const { register, handleSubmit, formState } = useForm<CredentialsModel>({
        mode: 'onBlur'   // Validation will trigger on the change event with each input
    });
    const navigator = useNavigate();

    async function submit(credentials: CredentialsModel) {
        try {
            await authService.login(credentials);
            notifyService.success("You are now logged in");
            navigator("/home");
        } catch(err: any) {
            notifyService.error(err);
        }
    }

    return (
        <div className="Login Box">
			<h2>Login</h2>

            <form onSubmit={handleSubmit(submit)}>

                <label>Username:</label>
                <input type="text" {...register("username",  {
                    required:  "Missing username",
                    minLength: { value: 8, message: "Userame must be minimum 8 chars" },
                    maxLength: { value: 20, message: "Userame can't exceed 20 chars" },
                })}/>
                <span>{formState.errors.username?.message}</span>


                <label>Password:</label>
                <input type="password" {...register("password",  {
                    required:  "Missing password",
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, 
                                message: 'Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character' }
                })}/>
                <span>{formState.errors.password?.message}</span>


                <button>Login</button>

            </form>
        </div>
    );
}

export default Login;
