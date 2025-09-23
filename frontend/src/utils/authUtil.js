export default function loginFunc(Func, username, password, navigate, route ,usertype) {

    let checkUniqChar = /[@#$%^&]/.test(username);
    let checkSpace = /^\s+$/.test(username);
    let checkSpacePass = /\s/.test(password);

    if(username.length < 5 || username.length > 15){
        alert('correct the length of username')
        return 1;
    } else if (password.length < 5 || password.length > 15){
        alert('correct the length of password')
        return 2;
    } else if(!checkUniqChar || checkSpace){
        alert('there must be spaces in the username or not including an unique char')
        return 3;
    } else if (checkSpacePass){
        alert('there is a space in password')
        return 4;
    }


    Func(username, password, usertype)
        .then(res => {
            if (res.statusText == 'Created') {
                navigate(route)
            } else if (res.statusText == 'OK') {
                navigate(route)
            }
        })
}