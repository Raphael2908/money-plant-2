export default formatter = (amount) => {
    // check if amount is whole number
    if (amount % 1 != 0) {
        throw new Error("Amount is not a whole number")
    }
    return (amount / 100).toLocaleString("en-US", {style:"currency", currency:"SGD"});
}
