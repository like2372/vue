import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    author: '李科',
    dataUrl:'',
    actileList:[],
    actileTotalNumber:"",
    actileDetail:{},
    loginSign:false,
  },
  mutations:{
  		newAuthor(state,msg){
  			state.author=msg
  		}, 		
  },
  actions:{
  		getActileList(context,data){
  				axios.get("/api/articleService/getArticleList?start="+data.start+"&end="+data.end)
  				.then(function(response){					
  					var data=response.data;					  					
  					context.state.actileList=data.data;		
  					context.state.actileTotalNumber=data.totalNumber;
  				})
  				.catch(function(error){
  					this.$Message.error('请求失败,error='+error);	
  				});
  		},
  		getActileDetail(context,id){
  				axios.get("/api/articleService/getArticleDetail?id="+id)
  				.then(function(response){					
  					var data=response.data;					  					
  					context.state.actileDetail=data.data[0];		
  				})
  				.catch(function(error){
  					this.$Message.error('请求失败,error='+error);	
  				});
  		},
  		putActile(context,value){			
  			var acticleJson=JSON.stringify(value);		
				var params = new URLSearchParams();
				params.append('articleJson', acticleJson);		
	  			axios.post("/api/articleService/insertArticleData",params,{
	                headers: {
	                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
	                }
	            })
	  			.then(function(response){
							this.$Message.success('保存成功');
							this.$router.push('/');
	  			})
	  			.catch(function(error){
	  					this.$Message.error('请求失败,error='+error);	
	  			});
  		},
  		deleActile(context,value){
  				axios.get("/api/articleService/deleteArticleData?id="+id)
  				.then(function(response){					
  					this.$Message.success('删除成功');	
  					this.$router.push('/');
  				})
  				.catch(function(error){
  					this.$Message.error('删除失败');	
  				});
  		}
  }
})

export default store