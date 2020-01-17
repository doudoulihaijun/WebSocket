<template>
  <div class="qiaodan">

    <div class="god">

      <div class="haoyou">我的好友</div>
      <div>
        <ul class="haoyoulist">
          <li><img class="touxiang" src="../../static/img/bbx.jpg"/><a href="#" v-on:click="xze('大吉大利','13811348632')">大吉大利</a></li>
          <li><img class="touxiang" src="../../static/img/ff.jpg"/><a href="#" v-on:click="xze('恭喜发财','18510449272')">恭喜发财</a></li>
          <li><img class="touxiang" src="../../static/img/dy.jpg"/><a href="#" v-on:click="xze('福来到','18510449273')">福来到</a></li>
        </ul>
      </div>
    </div>

   <div class="hello">

    <div class="ren" >
        {{dq}}
    </div>

    <div class="dibu1" v-html="message">

              <!-- <div class="atalk">
                 <img src="../../static/img/bbx.jpg"  />
                 <p id="wo">
                   我是马云我要把我的财产都给你，高兴么
                 </p>
               </div>

               <div class="afte">
                 <p id="other">我怎么那么想给你一板砖啊阿斯顿发生的发生的发生地方阿士大夫撒打算的阿斯顿发送到发送到
                 ！！！
                 </p>
                 <img src="../../static/img/bbx.jpg"  />
               </div>-->

    </div>

    <div class="dibu2">

          <div class="neirong1">
            <input type="text" v-model="mesval" :disabled="isdisabled ? false : 'disabled'"  @input="changedFn" style="width: 400px;height: 35px;"/>
          </div>

          <div class="fasong1">
            <button v-bind:class="{ absh: isActiveh , 'absb': isActiveb}"   v-on:click="flag && fasong()">默认按钮</button>
          </div>

    </div>

    <el-button  type="text" style="display:none" >点击打开 Message Box</el-button>
    <input v-model="userId" style="display: none;" />

  </div>

      <div class="zanzhu">

        <div class="haoyou">赞助</div>
        <div>
          <ul style="text-align: center;padding: 0;height: 100%;line-height: 50px;">
            <li>百度</li>
            <li>京东</li>
            <li>小米</li>
          </ul>
        </div>
      </div>

 </div>
</template>

<script>


  export default {
    name:'login',
    data() {

    			return {
                //message:'<div class="atalk"><img src="../../static/img/bbx.jpg"  /><p id="wo">我是马云我要把我的财产都给你，高兴么</p></div>'
                //<div class="afte"><p id="other">我怎么那么想给你一板砖啊阿斯顿发生</p><img src="../../static/img/bbx.jpg"  /></div>
                message:'',
                mesval:'',
                isActiveh:true,
                isActiveb:false,
                userId:'',
                dq:'未选中要聊天的好友',
                flag:false,
                toUserid:'',
                isdisabled:false

             }
    		},

        beforeDestroy() {

        },

        created() {

        },

        mounted: function() {
            // 初始化
            this.opens();
        },
        methods:{   //监听方法  click事件等，执行drawFeatures方法
           xze(xze,num){
              this.dq = xze;
              this.toUserid = num;
              this.isdisabled = true;
           },
           fasong() {
              var mes = '<div class="afte"><p id="other">'+this.mesval+'</p><img src="../../static/img/bbx.jpg"  /></div>';
              console.log(this.mesval+"------------");
              this.message =this.message + mes;

              this.changedFn();

              console.log(this.toUserid+"接收人id")

              axios.get('http://192.168.0.105:8081/api/ws/push/'+this.toUserid,{       // 还可以直接把参数拼接在url后边
                      params:{
                          message:this.mesval
                      }
              }).then(function(res){

                  var goodsList = res.data;

                 // alert("发送成功"+goodsList);

              }).catch(function (error) {
                  console.log(error);
              });

               this.mesval = "";
           },

          opens() {
                 var userid = window.sessionStorage.getItem("userId");
                 if(userid=='' || userid ==null){
                       this.$prompt('请输入手机号', '登录', {
                         confirmButtonText: '确定',
                         cancelButtonText: '取消111',
                         showClose:false,
                         distinguishCancelAndClose:true,
                         showCancelButton:false,
                         closeOnClickModal:false,
                         closeOnPressEscape:false,
                         inputPattern:/^1[3456789]\d{9}$/,
                         inputErrorMessage: '手机格式不正确'
                       }).then(({ value }) => {

                         window.sessionStorage.setItem("userId",value);
                         this.userId = value;
                         this.init(this.userId);
                         console.log(this.userId+"sssss")
                         this.$message({
                           type: 'success',
                           message: '欢迎'+value+'登录成功: '
                         });
                       }).catch(() => {
                         this.$message({
                           type: 'info',
                           message: '取消输入'
                         });
                       });
                 }

               },

         changedFn(){

            if(this.mesval=="" || this.mesval==null){
              //没值了
              this.isActiveh = true;
              this.isActiveb = false;
              this.flag=false;

            }else{
              //有值了
             this.isActiveh = false;
             this.isActiveb = true;
             this.flag=true;
            }

         },
         init: function (userId) {
           if(typeof(WebSocket) === "undefined"){
               alert("您的浏览器不支持socket")
           }else{
             console.log(userId+"用户登录id")
               // 实例化socket
               this.socket = new WebSocket("ws://192.168.0.105:8081/ws/asset/"+userId)
               // 监听socket连接
               this.socket.onopen = this.open
               // 监听socket错误信息
               this.socket.onerror = this.error
               // 监听socket消息
               this.socket.onmessage = this.getMessage
           }
        },
       open: function () {
           console.log("socket连接成功")
       },
       error: function () {
           console.log("连接错误")
       },
       getMessage: function (msg) {

             console.log(msg.data);

             var mes = '<div class="atalk"><img src="../../static/img/bbx.jpg"  /><p id="wo">'+msg.data+'</p></div>';

             if("连接成功"!=msg.data){
               if(this.message ==null ||  this.message =='' ){
                   this.message = mes;
               }else{
                   console.log(this.message);
                   console.log(mes);
                   this.message =this.message + mes;
               }
             }

       },
       send: function () {
           this.socket.send(params)
       },
       close: function () {
           console.log("socket已经关闭")
       }


    }

   }
</script>


<style>

  .ren{
     background-color: #E7E7E7;
     height: 50px;
     line-height: 50px;
     text-align: center;
  }

  .touxiang{
    width: 30px;
    height: 30px;
    padding-right: 10px;
  }
  .haoyoulist{
     text-align: left;
     padding: 0;
     height: 100%;
     line-height: 50px;

  }

  .haoyoulist li{

    padding-left: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  a{
    text-decoration:none;
    color:#000000;
   }


  ul li{
      list-style-type:none;
  }

  li:hover{
      background-color: #E7E7E7;
      font-size: 20px;
      color: red;
  }

  li:hover a{
      color: #000000;
  }


  .haoyou{
      background-color: #E7E7E7;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
  }
   .v-modal{
     opacity: 1.0;
   }


   .absh{
      width:80%;
      height: 25px;
      background-color:#e7e7e7;
      border-color:#e7e7e7;
      color: black;
      outline:none;
      border-radius: 5px;

   }

   .absb{
      width:80%;
      height: 25px;
      background-color:#32CD32;
      border-color:#32CD32;
      outline:none;
      border-radius: 5px;
   }


  .afte{
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-end;
  }
  .afte img{
      width:50px;
      height: 50px;
      margin: 10px;
  }

  #other{
     position: relative;
     width: 250px;
     background: #25a23b;
     border-radius: 5px;
     line-height: 18px;
     margin-left: 10px;
     word-break: break-word;
     font-weight: 50;
     color: #333;
     padding: 10px;
  }

  #other::after {
       content: "";
       display: block;
       position: absolute;
       width: 0;
       height: 0;
       border: 8px solid transparent;
       border-left-color:#25a23b;;
       top: 13px;
       left: 270px;
  }




  .atalk{
      display: flex;
      flex-direction: row;
      align-items: flex-start;
  }
  .atalk img{
      width:50px;
      height: 50px;
      margin: 10px;
  }

  #wo{
     position: relative;
     width: 250px;
     background: #ffffff;
     border-radius: 5px;
     line-height: 18px;
     margin-left: 10px;
     word-break: break-word;
     font-weight: 50;
     color: #333;
     padding: 10px;
  }

  #wo::after {
       content: "";
       display: block;
       position: absolute;
       width: 0;
       height: 0;
       border: 8px solid transparent;
       border-right-color: #FFFFFF;
       top: 15px;
       left: -16px;
  }

  .god{
      margin: 0 auto;
      border: 1px solid burlywood;
      width: 200px;
      height: 460px;
      float: left;
      border-right: none;
      border-bottom: none;
      font-size: 15px;
      background-color: #f5f5f5;
  }

  .zanzhu{
      margin: 0 auto;
      border: 1px solid burlywood;
      width: 200px;
      height: 460px;
      float: right;
      border-right: none;
      border-bottom: none;
      background-color: #f5f5f5;
  }

  .hello{
    margin: 0 auto;
    border: 1px solid burlywood;
    width: 500px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: #f5f5f5;

  }

  .qiaodan{
    margin: 0 auto;
    border: 1px solid burlywood;
    width: 900px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: #f5f5f5;
  }

  .dibu1{
      height: 407px;
      overflow:auto;
  }
  .dibu2{
     display: flex;
     flex-direction: row;
  }

  .neirong1{
     width: 80%;
  }

  .fasong1{

    width: 20%;
    height: 38px ;
    line-height: 38px ;
    text-align: center;
    border-top:1px solid burlywood ;
  }



</style>
