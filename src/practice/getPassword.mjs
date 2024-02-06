import * as cp from "child_process";
console.log('password: ');

//cp.execSync('read', (err, res) => {console.log('echo' + res)});
//let res = cp.exec('sleep 10 && echo "roodo"');
//let res = cp.exec('read -s');
//('data', console.log);
//res.stdin = process.stdin;
// res.stdout.on('data', console.log);

//let pass = cp.spawn("sh", ["-c", "read"], {stdio: "inherit", stdin: "inherit"});
//let pass = cp.spawn("read", {stdio: "inherit", stdin: "inherit"});
//pass.stdout.on('data', console.log);
const ls = cp.spawn('read YO && echo $YO');

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});


