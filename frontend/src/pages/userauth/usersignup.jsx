import useAuthStore from "../../stores/authStore.jsx";
import AuthTemplate from "../../component/UserAuthTemplate.jsx";

export default function SignUp() {

    let {usersignUp} = useAuthStore();

    return (
        <>
       <AuthTemplate Func={usersignUp}  what={'SignUp'}/>
        </>
    )
}