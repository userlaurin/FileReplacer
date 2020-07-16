var zip = require('adm-zip');
const fs = require("fs");
const path = require("path");



const FileReplacer = (first, save) => {
    var new_file = new zip(first);
    var content = new_file.getEntries();
    content.forEach(function(entry) {
        //get the target file into memory
        if(entry.entryName === 'assets/js/CPM.js') {
            var file_content = new_file.readAsText(entry.entryName);
            //replace the specific links with a regex expression
            var all_the_links = file_content.match(options.regex);
            var changed = file_content;
            var lastLink = '';
            //check if there are any links from linkedin
            if(typeof all_the_links != "undefined" && all_the_links != null && all_the_links.length != null
            && all_the_links.length > 0) {
                //iterate through them
                for (link of all_the_links) {
                    //prepare the found link (remove garbage at beginning and end)
                    link = link.replace(/\\'/g, '');
                    link = link.replace(/84251778/, '91463058');
                    //if there hasn't been a link like this and if its the first one, do a global replacement of the link
                    if(lastLink == '' || lastLink != link) {
                        var regex_exp = new RegExp(/\\'(.?https?:\/\/(www\.)?linkedin\.com\/learning.+?)\\'/, "g");
                        //form the new link
                        var output = options.to+link+options.end;
                        changed = changed.replace(regex_exp, output);
                        lastLink = link;
                    }
                }
            }
            //store the file back into the zip
            var store = Buffer.from(changed, 'utf8');
            new_file.updateFile('assets/js/CPM.js', store);
        }
    });
    console.log('Changed: '+ first + ' to: '+ save);
    //write the zip to the new location
    new_file.writeZip(save);
}
//stuff needed for regex replacement
const options = {
    regex: /\\'(.?https?:\/\/(www\.)?linkedin\.com\/learning.+?)\\'/g,
    test: /\'(.?https?:\/\/(www\.)?linkedin\.com.+?)\'/g,
    to: "\\'https://www.linkedin.com/checkpoint/enterprise/login/91463058?pathWildcard=91463058&application=learning&authModeName=LTI-3&redirect=",
    end: "\\'"
}
//recursive iteration function through the whole specified directory that uses the paths to clone the directory and replace all the links
function walk(dir) {
    return new Promise((resolve, reject) => {
      fs.readdir(dir, (error, files) => {
        if (error) {
          return reject(error);
        }
        Promise.all(files.map((file) => {
          return new Promise((resolve, reject) => {
            const filepath = path.join(dir, file);
            fs.stat(filepath, (error, stats) => {
              if (error) {
                return reject(error);
              }
              if (stats.isDirectory()) {
                walk(filepath).then(resolve);
              } else if (stats.isFile()) {
                resolve(filepath);
                if(filepath.includes('.zip')) {
                    FileReplacer(filepath, filepath.replace(dir_name, new_dir_name));
                }
              }
            });
          });
        }))
        .then((foldersContents) => {
          resolve(foldersContents.reduce((all, folderContents) => all.concat(folderContents), []));
        });
      });
    });
  }

//initiate the process on a certain directory
var first = "/Users/laurinjahns/Scorms_Unchanged";
var dir_name = "Scorms_Unchanged";
var new_dir_name = "Scorms_Changed";
walk(first);
console.log('Success');