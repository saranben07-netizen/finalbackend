 async function test(){

    console.log("Before asyncTask");

const a =  await (new Promise((resolve, reject) => {
  console.log("Task started");

  setTimeout(() => {
    resolve("Task finished"); // completes after 2s
  }, 2000);
}));


console.log(a)

console.log("After asyncTask");

}

test()