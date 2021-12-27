//StorageContraller

const StorageController = (function(){

return{

    storeProduct:function(product){
        let products;

        if(localStorage.getItem('products')===null){

            products=[];
            products.push(product);
          

        }else{

            products=JSON.parse(localStorage.getItem('products'));
            products.push(product);

        }

        localStorage.setItem('products',JSON.stringify(products));

    },
    getProducts:function(){

        let products;
        if(localStorage.getItem('products')==null){

          products=[];

        }else{
            
            products=JSON.parse(localStorage.getItem('products'));

        }

        return products;

    },
    updateProduct:function(product){

        let products=JSON.parse(localStorage.getItem('products'));

        products.forEach(function(prd,index){
                if(prd.id==product.id){
                    products.splice(index,1,product);
                }
        });

        localStorage.setItem('products',JSON.stringify(products));

    },
    deleteProduct:function(id){

        let products=JSON.parse(localStorage.getItem('products'));

        products.forEach(function(prd,index){
                if(prd.id==id){
                    products.splice(index,1);
                }
        });

        localStorage.setItem('products',JSON.stringify(products));

    }

}

})();

//ProductController

const ProductController=(function(){

const Product = function(id,name,price){

    this.id=id;
    this.name=name;
    this.price=price;

}

const data ={
    products:StorageController.getProducts(),
    selectedProduct:null,
    totalPrice:0

}

return{

    getProducts:function(){
        return data.products;
    },

    getData:function(){
        return data;
    },

    getProductsById:function(id){

        let product=null;

        data.products.forEach(prd=>{

            if(prd.id==id){

                product=prd;
            }

        })


        return product;
    },

    setCurrentProduct:function(prd){
      
        data.selectedProduct=prd;

    },

    getCurrentProduct:function(){

        return data.selectedProduct;

    },

    addProduct:function(name,price){

        let id;

        if(data.products.length>0){

            id=data.products[data.products.length-1].id+1;
        }else{
            id=0;
        }

        const newProduct = new Product(id,name,parseFloat(price));

        data.products.push(newProduct);

        return newProduct;

    },
    deleteProduct:function(product){

        data.products.forEach((prd,index)=>{

            if(prd.id==product.id){
                data.products.splice(index,1);
            }
            

        })

    },
    getTotal:function(){
        let total=0;
        data.products.forEach(item=>{
            total+=item.price;
        })

        data.totalPrice=total;

        return data.totalPrice;
    },
    updateProduct:function(name,price){

        let product=null;

        data.products.forEach(prd=>{

            if(prd.id==data.selectedProduct.id){

                prd.name=name;
                prd.price=parseFloat(price);
                product=prd;
            }

        })

        return product;
    }
}

})();

//UI Controller

const UIController=(function(){


    const Selector={
        productListItems:'#item-list tr',
        productList:'#item-list',
        addBtn:'.addBtn',
        editBtn:'.editBtn',
        deleteBtn:'.deleteBtn',
        cancelBtn:'.cancelBtn',
        productName:'#ProductName',
        productPrice:'#ProductPrice',
        productCard:'#productCard',
        totalTL:"#total-tl",
        totalDolar:"#total-dolar"

    }

    return {

        createProductList:function(products){
            let html='';

            products.forEach(prd=> {
                html+=`
                <tr>
                <td>${prd.id}</td>
                <td>${prd.name}</td>
                <td>${prd.price} $</td>
                <td class="text-end">
                    <i class="fas fa-edit edit-product"></i>
                 </td>
            </tr>                
                `
            });


            document.querySelector(Selector.productList).innerHTML=html;
        },
        addProduct:function(prd){

            document.querySelector(Selector.productCard).style.display='block';

            var item=`
            <tr>
            <td>${prd.id}</td>
            <td>${prd.name}</td>
            <td>${prd.price} $</td>
            <td class="text-end"> 
            <i class="fas fa-edit edit-product"></i>
             </td>
            </tr>  
            
            `;

            document.querySelector(Selector.productList).innerHTML+=item;
        },
        updateProduct:function(prd){

            let updatedItem=null;

            let items=document.querySelectorAll(Selector.productListItems);

            items.forEach(item=>{

                if(item.classList.contains('bg-warning')){

                    item.children[1].textContent=prd.name;
                    item.children[2].textContent=prd.price + " $";
                    updatedItem=item;

                }

            })

            return updatedItem;

        },
        clearInputs:function(){

            document.querySelector(Selector.productName).value="";
            document.querySelector(Selector.productPrice).value="";
        },
        ClearWarnings:function(){
         
            const items=document.querySelectorAll(Selector.productListItems);
            
            items.forEach(item=>{

                if(item.classList.contains('bg-warning')){

                    item.classList.remove('bg-warning');

                }


            })
        
        },
        hideCard:function(){

            document.querySelector(Selector.productCard).style.display='none';

        },
        showTotal:function(total){

            document.querySelector(Selector.totalDolar).textContent=total;
            document.querySelector(Selector.totalTL).textContent=total*4.5;

        },
        addProductToForm:function(){

            const selectedProduct=ProductController.getCurrentProduct();

            document.querySelector(Selector.productName).value=selectedProduct.name;
            document.querySelector(Selector.productPrice).value=selectedProduct.price;


        },
        getSelectors:function(){
            return Selector;
        },
        deleteProduct:function(){

            const items=document.querySelectorAll(Selector.productListItems);
            
            items.forEach(item=>{

                if(item.classList.contains('bg-warning')){

                      item.remove();

                }
            })
            

        },
        addingStyle:function(item){
            
            UIController.ClearWarnings();
            UIController.clearInputs();
            document.querySelector(Selector.addBtn).style.display='inline';
            document.querySelector(Selector.deleteBtn).style.display='none';
            document.querySelector(Selector.editBtn).style.display='none';
            document.querySelector(Selector.cancelBtn).style.display='none';

        },
        updateStyle:function(tr){

            tr.classList.add('bg-warning');
            document.querySelector(Selector.addBtn).style.display='none';
            document.querySelector(Selector.deleteBtn).style.display='inline';
            document.querySelector(Selector.editBtn).style.display='inline';
            document.querySelector(Selector.cancelBtn).style.display='inline';

        }
    }


})();


//APP Controller

const App=(function(ProductCtrl,UICtrl,StorageCtrl){

    const UISelectors=UICtrl.getSelectors();

    //load event Listener
    const loadEventListener=function(){

        //addProduct
        document.querySelector(UISelectors.addBtn).addEventListener("click",productAddSubmit);
        //edit product click
        document.querySelector(UISelectors.productList).addEventListener("click",productEditClick);
        //edit product submit
        document.querySelector(UISelectors.editBtn).addEventListener("click",editProductSubmit);
        //edit product cancel
        document.querySelector(UISelectors.cancelBtn).addEventListener("click",cancelUpdate);
        //edit product delete
        document.querySelector(UISelectors.deleteBtn).addEventListener("click",deleteProductSubmit);

    }
    //add button
    const productAddSubmit =function(e){

        const productName=document.querySelector(UISelectors.productName).value;

        const productPrice=document.querySelector(UISelectors.productPrice).value;


        if(productName!==''&&productPrice!==''){

            //add product
           const newProduct=ProductCtrl.addProduct(productName,productPrice);
           
           //add item to list
           UIController.addProduct(newProduct);
           
           //add LocalStorage
           StorageCtrl.storeProduct(newProduct);
           //totalPrice

           const total=ProductCtrl.getTotal();
           
           //show total
            UICtrl.showTotal(total);
           

           //clear inputs

           UICtrl.clearInputs();
            

        }
      

        e.preventDefault();
    }
    //edit button
    const productEditClick=function(e){

        if(e.target.classList.contains('edit-product')){

        const id=e.target.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.textContent;

        //get selected prdouct
        const product=ProductCtrl.getProductsById(id);


        //set current product
        ProductCtrl.setCurrentProduct(product);
        
        UICtrl.ClearWarnings();
        //add product to UI
        UICtrl.addProductToForm();

        UICtrl.updateStyle(e.target.parentNode.parentNode);

        }


        e.preventDefault();
    }
    //delete button
    const deleteProductSubmit=function(e){

        const getSelectedProduct=ProductCtrl.getCurrentProduct();
       
        //delete product
        ProductCtrl.deleteProduct(getSelectedProduct);

        //delete ui
        UICtrl.deleteProduct();

         //deleteFromStorage
        StorageCtrl.deleteProduct(getSelectedProduct.id);

        const total=ProductCtrl.getTotal();
         
        
        
        //show total
         UICtrl.showTotal(total);
       
         

         //clear input 
         UICtrl.addingStyle();

         //delete card for zero element
         if(total==0){
             UICtrl.hideCard();
         }


        e.preventDefault();
    }
    //update button
    const editProductSubmit=function(e){

        const productName=document.querySelector(UISelectors.productName).value;

        const productPrice=document.querySelector(UISelectors.productPrice).value;

        if(productName!==''&&productPrice!==''){

            //update product
            const updatedProduct=ProductCtrl.updateProduct(productName,productPrice);

           let item = UICtrl.updateProduct(updatedProduct);

           const total=ProductCtrl.getTotal();
           
           //show total
            UICtrl.showTotal(total);
            //updateStorage
            StorageCtrl.updateProduct(updatedProduct);
            UICtrl.addingStyle();
           

        }
      

        e.preventDefault();
    } 
    //cancel button
    const cancelUpdate=function(e){

        UICtrl.addingStyle(); 
        e.preventDefault();
    }  
    
    return {
        init :function(){

            console.log("start app..")

            UICtrl.addingStyle();
            const products=ProductCtrl.getProducts();

            if(products.length==0){
                UICtrl.hideCard();
            }else{

                UICtrl.createProductList(products);
                

            }

            loadEventListener();
            

        }
    }

})(ProductController,UIController,StorageController);

App.init();