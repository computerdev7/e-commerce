import useStore from "../../store.jsx";
import AuthTemplate from "../../component/UserAuthTemplate.jsx";

export default function Login() {

    let {userlogin} = useStore();

    return (
        <>
       <AuthTemplate Func={userlogin} what={'Login'}/>
        </>
    )
}