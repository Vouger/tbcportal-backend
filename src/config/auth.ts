export default function getJwtSecret(){
    return process.env.JWT_SECRET || '';
}