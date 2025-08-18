import useAuthStore from "../../stores/authStore.jsx";
import AuthTemplate from "../../component/UserAuthTemplate.jsx";

export default function Login() {

    let {userlogin} = useAuthStore();

    return (
        <>
       <AuthTemplate Func={userlogin} what={'Login'}/>
        </>
    )
}