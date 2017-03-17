/**
 * https://www.npmjs.com/package/cpx
 * https://www.npmjs.com/package/mkdirp
 * https://www.npmjs.com/package/rimraf
 * https://archiverjs.com/docs/
 */
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var moment = require("moment");
var archiver = require('archiver');

var zip = function () {
    const execSync = require('child_process').execSync;
    const gitversion = execSync('git describe --tags --always --dirty') + "";
    const time = moment().format("YYYY-MM-DDTHHmmss");

    let entryFolder = "DS-MSR-" + gitversion.replace(/\r?\n/g, "");
    entryFolder = entryFolder + "-" + time;

    console.log(entryFolder);


    var zip_file_name = "./dist/" + entryFolder + "\.zip";

    // zipファイルのストリームを生成して、archiverと紐付ける
    var archive = archiver.create('zip', {zlib: {level: 9}});
    var output = fs.createWriteStream(zip_file_name);
    output.on("close", function () {
        var archive_size = archive.pointer() + " total bytes";
    });

    archive.pipe(output);

    const dest_root = entryFolder;

    // append a file from buffer
    var buffer3 = new Buffer(time);
    archive.append(buffer3, {name: dest_root + '/create_zip_time.txt'});

    // append a file
    archive.file('README.md', {name: dest_root + '/README.md'});

    // append files from a directory
    archive.directory('src/', dest_root + "/src/");

    // append files from a glob pattern
    archive.glob('build/**', {}, {prefix: dest_root});

    // zip圧縮実行
    archive.finalize();

}

rimraf("./dist", function (error_rm) {
    if (error_rm) {
        console.log(error_rm);
    } else {
        mkdirp("./dist", function (error_mkdir) {
            if (error_mkdir) {
                console.log(error_mkdir);
            } else {
                zip();
            }
        });
    }
});









