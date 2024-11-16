var express = require('express');
var router = express.Router();

//them model
const Distributors = require('../models/distributor');
const Fruits = require('../models/fruits');

router.post('/add_distributor', async (req, res)=>{
    try {
        const data = req.body;
        const newDistributors = new Distributors({
            name: data.name
        });
        const result = await newDistributors.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/add_fruit', async (req,res) => {
    try {
        const data = req.body;
        const newFruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.price,
            image: data.image,
            description: data.description,
            id_distributor: data.id_distributor
        });
        const result = await newFruit.save();
        if (result) {
            res.json({
                "status": 200,
                "messenger": "Thêm thành công",
                "data": result
            })
        } else {
            res.json({
                "status": 400,
                "messenger": "Lỗi, thêm không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/get-list-fruit', async (req,res) => {
    try {
        const data = await Fruits.find().populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/get-fruit-by-id/:id', async (req,res) => {
    try {
        const {id} = req.params
        const data = await Fruits.findById(id).populate('id_distributor');
        res.json({
            "status": 200,
            "messenger": "danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error);
    }
})

router.get('/get-list-fruit-in-price', async (req, res) => {
    try {
        const {price_start, price_end} = req.query

        const query = {price: {$gte: price_start, $lte: price_end} };

        const data = await Fruits.find(query, 'name quantity price id_distributor')
                                .populate('id_distributor')
                                .sort({quantity: -1})
                                .skip(0)
                                .limit(2)
        res.json({
            "status": 200,
            "messenger": "danh sách fruit",
            "data": data
        });
    } catch (error) {
        
    }
})

router.get('/get-list-fruit-have-name-a-or-x', async (req, res) => {
    try {
        const query = {$or: [
            {name: {$regex: 'a'}},
            {name: {$regex: 'x'},}
        ]}

        const data = await Fruits.find(query, 'name quantity price id_distributor')
                                .populate('id_distributor')

        res.json({
            "status": 200,
            "messenger": "danh sách fruit",
            "data": data
        })
    } catch (error) {
        console.log(error)
    }
})

router.put('/update-fruit-by-id/:id', async (req,res) => {
    try {
        const {id} = req.params
        const data = req.body;
        const updatefruit = await Fruits.findById(id)
        let result = null;
        if (updatefruit) {
            updatefruit.name = data.name ?? updatefruit.name;
            updatefruit.quantity = data.quantity ?? updatefruit.quantity;
            updatefruit.price = data.price ?? updatefruit.price;
            updatefruit.status = data.status ?? updatefruit.status;
            updatefruit.image = data.image ?? updatefruit.image;
            updatefruit.description = data.description ?? updatefruit.description;
            updatefruit.id_distributor = data.id_distributor ?? updatefruit.id_distributor;
            result = await updatefruit.save();
        }
        if (result) {
            res.json({
                "status": 200,
                "messenger": "cập nhật thành công",
                "data": result
            })
        } else{
            res.json({
                "status": 400,
                "messenger": "Lỗi, cập nhật không thành công",
                "data": []
            })
        }
    } catch (error) {
        console.log(error)
    }
})

//get by id
router.get("/getDistributorById/:id", async (req, res) => {
    try {
      //lấy id được truyền lên bằng param
      const { id } = req.params;
      const data = await Distributor.findById(id);
      res.json({
        status: "200",
        message: "success",
        data: data,
      });
    } catch (error) {}
  });

  //get all distributor
router.get("/getAllDistributor", async (req, res) => {
    try {
      const data = await Distributor.find();
      res.json({
        status: 200,
        message: "success",
        data: data,
      });
    } catch (error) {
      res.json({
        status: 400,
        message: "not success",
        data: error,
      });
    }
  });

  //update distributor by id
router.put("/updateDistributorById/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const dataUpdate = req.body;
  
      const updatedDistributor = await Distributor.findByIdAndUpdate(
        id,
        dataUpdate,
        {
          new: true, // Trả về sản phẩm đã cập nhật
          runValidators: true, // Kiểm tra dữ liệu đầu vào theo schema
        }
      );
      if (!updatedDistributor) {
        res.json({
          status: 400,
          message: "lỗi",
        });
      } else {
        res.json({
          status: 200,
          message: "update success",
          data: updatedDistributor,
        });
      }
    } catch (error) {
      res.json({
        status: 400,
        message: "lỗi",
        data: error,
      });
    }
  });

//xóa distributor by id
router.delete("/deleteDistributorById/:id", async (req, res) => {
    try {
      const { id } = req.params; // Lấy ID sản phẩm từ params\
      // Tìm và xóa sản phẩm theo ID
      const deletedDistributor = await Distributor.findByIdAndDelete(id);
      if (deletedDistributor) {
        res.json({
          status: 200,
          message: "delete success",
          data: deletedDistributor,
        });
      }
    } catch (error) {
      res.json({
        status: 400,
        message: "delete not success",
        data: error,
      });
    }
  }); 

//xóa distributor by id và name
router.delete("/deleteDistributorById/:id/:name", async (req, res) => {
    try {
      const { id, name } = req.params; // Lấy ID sản phẩm từ params\
      // Tìm và xóa sản phẩm theo ID
      const deletedDistributor = await Distributor.findByIdAndDelete({
        _id: id,
        name: name,
      });
      if (deletedDistributor) {
        res.json({
          status: 200,
          message: "delete success",
          data: deletedDistributor,
        });
      } else {
        res.json({
          status: 400,
          message: "delete not success",
          data: deletedDistributor,
        });
      }
    } catch (error) {
      res.json({
        status: 400,
        message: "delete not success",
        data: error,
      });
    }
  });
module.exports = router;