require('dotenv').config()
const path = require('path')
const {exec} = require('child_process')
// const { stderr } = require('process')

// const getAuth = () => {
//     return null
// }

const postToRunModel = async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        if (!username || !password) {
            return res.status(400).json({
                msg: "Username or Password is required"
            })
        }

        if (username == 'Ender' && password == '789') {
            let stock_id = req.body.stock_id || '2330'
            let stock_name = req.body.stock_name || 'TSMC'
            const target = path.join(__dirname, '..', 'models/test.py')
            // const target = path.join(__dirname, '..', 'models/main.py')
            
            const command = `chcp 65001 && python ${target} ${stock_id} ${stock_name}`
            
            console.log(command)
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`)
                    return
                  }
                  console.log(`stdout: ${stdout}`)
                  console.error(`stderr: ${stderr}`)
            })
            
            res.status(200).json({
                msg: 'ok'
            })
        } else {
            res.status(401).json({
                msg: 'Unauthorized'
            })
        }
  
    
    } catch (err) {
        console.log(err)
        return res.sendStatus(500).json( {
            msg: "Server Error."
        })
    }
}

module.exports = {
    postToRunModel
}


