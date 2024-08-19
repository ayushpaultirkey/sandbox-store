function giturl(url, branch) {
    const domain = "https://raw.githubusercontent.com/";
    const repository = url.split("https://github.com/")[1];

    return `${domain}${repository}/${branch}`;
}

function gitParseURL(url) {

    let user;
    let repository;

    const matchs = url.matchAll(/(?:https:\/\/github\.com\/)([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/gm);

    for(const match of matchs) {
        user = match[1];
        repository = match[2];
        break;
    }

    return { user: user, repository: repository }

}

function gitRawURL(user, repository, branch) {
    return `https://raw.githubusercontent.com/${user}/${repository}/${branch}`;
}

function gitReleaseURL(user, repository) {
    return `https://api.github.com/repos/${user}/${repository}/releases`;
}

export default { giturl, gitParseURL, gitRawURL, gitReleaseURL };