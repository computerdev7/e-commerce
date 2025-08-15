import useStore from "../../store.jsx";
import AuthTemplate from "../../component/UserAuthTemplate.jsx";

export default function SignUp() {

    let {usersignUp} = useStore();

    return (
        <>
       <AuthTemplate Func={usersignUp}  what={'SignUp'}/>
        </>
    )
}