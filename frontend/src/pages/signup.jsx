import useStore from "../store.jsx";
import AuthTemplate from "../component/AuthTemplate.jsx";

export default function SignUp() {

    let {signUp} = useStore();

    return (
        <>
       <AuthTemplate Func={signUp}/>
        </>
    )
}