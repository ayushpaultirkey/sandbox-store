function giturl(url, branch) {
    const domain = "https://raw.githubusercontent.com/";
    const repository = url.split("https://github.com/")[1];

    return `${domain}${repository}/${branch}`;
}
export default { giturl };