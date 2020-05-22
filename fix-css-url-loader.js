module.exports = function (content) {
    var maches = content.match(/url\(\S*\.(eot|woff|ttf|svg)\";/g);
    console.log(maches);
    for (let i in maches) {
        let str = maches[i];
        content = content.replace(str, str.replace(/\";/g, ""));
    }
    return content;
}