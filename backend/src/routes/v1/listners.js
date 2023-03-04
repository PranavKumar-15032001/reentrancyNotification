const { blockchainController } = require("../../controllers")

const startListeners = () => {
    blockchainController.startListeners().then().catch(
        (err)=> {
            console.log("Error while initializing : ",err);
        }
    );
}
module.exports = {
    startListeners
}