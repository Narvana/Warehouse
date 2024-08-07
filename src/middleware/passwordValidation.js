const validatePassword=(password)=>
{
    const regex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+}{|@''""/?,<>.#$!%*?_&^-])[A-Za-z\d+}{|@''""/?,<>.#$!%*?_&^-]{8,15}$/;
    return regex.test(password);
}

module.exports=validatePassword;
