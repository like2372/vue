<template>
  <div class="hello" >
			<div class="main">
					<div class="leftOrTop">
						<div class="nav-bar">
								<div class="nav-bar-head" >LiKe博客</div>
								<div class="nav-bar-body">
									<ul>
										<li id="createArticle" @click="toApp('/createArticle')"  @mousemove="liMouseMove" @mouseleave="liMouseLeave" v-if='loginSign' >{{createArticle}}</li>
										<li id="newBlog"  class="mouseClick" >最新博客</li>
										<li id="viewLogs" @mousemove="liMouseMove" v-if='loginSign' @click="toApp('/viewLogs')" @mouseleave="liMouseLeave"  >查看日志</li>
										<li id="aboutMe" @mousemove="liMouseMove" @click="toApp('/AboutMe')" @mouseleave="liMouseLeave" >关于我的</li>
									</ul>
								</div>
								<div class="nav-bar-foot">
									<i-button type="primary" @click="toApp('/login')" v-if='!loginSign'>登录</i-button>
									<i-button type="primary"  @click="logout" v-if='loginSign'>注销</i-button>
								</div>
						</div>
					</div>
					<div class="rightOrBottom">
							<div class="rightMain">
								<div class="tab-head">
									<div class="tab-head-left">
										<div class="pTitle" >
											<p>{{newArticle}}</p>
										</div>
										<div class="item-border"></div>
									</div>
									<div class="tab-head-right">
										<div class="showEditButton">
											<i-button type="primary" v-if="loginSign" @click="showEditButton">操作</i-button>
										</div>
									</div>
								</div>
								<div class="tab-main">
									<Modal v-model="deleModal" title="是否删除该条？" @on-ok="deleteActicle(this)">
											        <p>是否删除该条？</p>
									</Modal>
									<div v-for="item in topicList" class="artile">
										<div class="artile-body" >
													<div class="close-div" @click="showModal" :item-id="item.id" v-show="showEdit&&loginSign">
														<Icon style="color:black;float:right;" type="close-round" ></Icon>
													</div>
													<div class="update-div" @click="toApp('/updateArticle/'+item.id)" v-show="showEdit&&loginSign" >
														<Icon  style="color:black;float:right;" type="edit" ></Icon>
												</div>
												<div class="artile-title" @click="toArtile">{{item.articleTitle}}<span v-show="false">{{item.id}}</span></div>
												<div class="artile-time">{{item.articleTime}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;浏览量:{{item.articlePageView}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="acticleTag">{{item.articleTage}}</span></div>
												<div class="artile-main">{{item.articleShortContent}}</div>
										</div>
									</div>
									<!--<div v-for="n in pageSize" class="artile">
										<div class="artile-body">
												<div class="artile-title" @click="toArtile">{{artileTile}}<span v-show="false">{{}}</span></div>
												<div class="artile-time">{{artileTime}}</div>
												<div class="artile-main">{{artileMain}}</div>
										</div>
									</div>	-->
								</div>
								<Page :total='totalNumber' @on-change="pageChange" :page-size="pageSize" style="margin-right:5%;margin-top:5%;height:5%;" ></Page>
							</div>
					</div>
			</div>

			<!--<div class="foot"></div>-->
  </div>
</template>

<script>

import auth from '@/utils/auth'

import api from '@/utils/api'


export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      title:'LiKe博客',
      createArticle:'创建博客',
      newBlog:'最新博客',
      aboutMe:'关于我的',
      pageSize:6,
      mouseSign:false,
      newArticle:'最新文章',
      artileTile:'深入理解 Linux 的 RCU 机制',
      artileTime:'2017-11-18 17:09:05',
      artileMain:'RCU(Read-Copy Update)，是 Linux 中比较重要的一种同步机制。顾名思义就是“读，拷贝更新”',
      loginSign:auth.loggedIn(),
      showEdit:false,
      deleModal:false,
      deleId:"",
    }
  },
  created:function(){
  	var data={};
  	data.start=0;
  	data.end=this.pageSize;
		this.$store.dispatch('getActileList',data);
  },
  computed:{
  	topicList(){
  		return this.$store.state.actileList;
  	},
  	totalNumber(){
  		var total=this.$store.state.actileTotalNumber;
  		return parseInt(total);
  	},
  },
  methods:{
  	liMouseMove(e){
  			var el=e.target;
  			el.classList.add("mouseMove");
  			el.classList.remove("mouseLeave");
  	},
  	liMouseLeave(e){
  		  var el=e.target;
  		  el.classList.add("mouseLeave");
  		 	el.classList.remove("mouseMove");
  	},
  	backToHome(e){
  			this.$router.push('/AboutMe');
  	},
  	toArtile(e){
  			//alert(123);
  			var ele=e.target;
  			var spanEle=ele.firstElementChild;
  			var articleId=spanEle.innerHTML;
  			//调用增加浏览量接口
  			api.get("/api/articleService/updateArticlePageView?id="+articleId)
  			.then(function(response){
  				if(response.data.resultCode=="1"){
  						//this.$Message.success("");
  				}else{
  					console.log(response);
  				}
  			}.bind(this));

  			//跳转到文章页面
  			this.$router.push('/Artile/'+articleId);
  	},
  	toApp(path){
  			this.$router.push(path);
  	},
  	pageChange(e){
  			var data={};
  			data.start=(e-1)*this.pageSize;
  			data.end=this.pageSize;
  			this.$store.dispatch('getActileList',data);
  	},
  	logout(){
  			auth.logout();
  			this.$router.push('/AboutMe');
  	},
  	showModal(e){
  		var el=e.target;
  		var id=el.parentNode.getAttribute("item-id");
  		this.deleId=id;
  		this.deleModal=true;
  	}
  	,
  	deleteActicle(){
  			var acticleJson={};
  			acticleJson.id=this.deleId;
  			api.post("/api/articleService/deleteArticleData",acticleJson)
  			.then(function(response){
  				if(response.data.resultCode=="1"){
  					this.$Message.success("删除成功");
  					window.location.reload();
  				}else{
  					this.$Message.error("删除失败");
  				}
  			}.bind(this));
  	},
  	showEditButton(){
  		if(this.showEdit){
  			this.showEdit=false;
  		}else{
  			this.showEdit=true;
  		}

  	}
 }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>


