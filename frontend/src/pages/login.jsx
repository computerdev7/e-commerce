import useStore from "../store.jsx";
import AuthTemplate from "../component/AuthTemplate.jsx";

export default function Login() {

    let {login} = useStore();

    return (
        <>
       <AuthTemplate Func={login}/>
        </>
    )
}