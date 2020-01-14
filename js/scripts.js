var app = new Vue({  
  el: '#app',  
  data: {    
   miembros:[],
   estado: "all",
   parties :[]
  },
    created: ()=>{
        let url = document.getElementById("senate") ? "https://api.propublica.org/congress/v1/113/senate/members.json" : "https://api.propublica.org/congress/v1/113/house/members.json"
        let key = "11maqCzCx9CErkOrtAm3WpGKNeu8iKPakWgRJHzI"
        fetch(url,{
                method: 'GET',
                headers: {
                    'X-API-Key': key
                }
    }).then(function(respt){
        if(respt.ok)
            return respt.json();
        else
            throw new Error;
    }).then(function(json){
        data = json;
        app.miembros = data.results[0].members; 
        app.creandoParties();
        }).catch( function(error){
        console.log(error);
    })
    },
    methods:{
     mostrarMiembros(){
        return this.miembros.filter(x => app.parties.includes(x.party) && (app.estado == x.state || app.estado == "all") ? x : null)
        },
        creandoParties(){
            this.parties= [];
            this.miembros.forEach(x => !this.parties.includes(x.party)? this.parties.push(x.party) : null);
            this.parties.sort();
        }

    },
    computed: {
        creandoDesplegable2(){
        let estadoElegido= [];
        this.miembros.forEach(x => !estadoElegido.includes(x.state)? estadoElegido.push(x.state): null);
        
        return estadoElegido.sort();
        }
     }
}); 
