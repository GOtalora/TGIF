const app = new Vue({
    el: '#app',
    data:{
        miembros: [],
        tablaAtAGlance: {
            totalVotos:0,
            totalVotosPct:0,
            cantDemocratas:0,
            promedioPorcDemocratas:0,
            cantRepublicanos:0,
            promedioPorcRepublicanos:0,
            cantIndependientes:0,
            promedioPorcIndependientes:0
        }
    },
    created :  () => {
    let url = document.getElementById("senate") ? "https://api.propublica.org/congress/v1/113/senate/members.json" : "https://api.propublica.org/congress/v1/113/house/members.json"
    let key = "11maqCzCx9CErkOrtAm3WpGKNeu8iKPakWgRJHzI";

            fetch(url,{
                method: 'GET',
                headers: {
                    'X-API-Key': key
                }
            }).then(function(respt){
                    if(respt.ok){
                                return respt.json()
                            }else{
                                throw new Error()
                            }
                        }).then(function(json){
                            app.miembros = json.results[0].members;
                            app.iniciarDatos();
                        }).catch(function(error){
                            console.log(error)
                        })     
    },
    methods: {
    iniciarDatos(){
            this.miembros.forEach(x =>{
                switch(x.party){
                    case "R":{                    this.tablaAtAGlance.cantRepublicanos++;
                        this.tablaAtAGlance.promedioPorcRepublicanos+= x.votes_with_party_pct;
                         break;
                    }
                    case "D":{
                        this.tablaAtAGlance.cantDemocratas++;
                        this.tablaAtAGlance.promedioPorcDemocratas += x.votes_with_party_pct;
                        break;
                    }
                    case "I":{
                        this.tablaAtAGlance.cantIndependientes++;
                        this.tablaAtAGlance.promedioPorcIndependientes+= x.votes_with_party_pct;
                        break;
                    }
                }
        })
    
        this.tablaAtAGlance.totalVotos=this.miembros.length;
        this.tablaAtAGlance.totalVotosPct=parseFloat((this.tablaAtAGlance.promedioPorcDemocratas + this.tablaAtAGlance.promedioPorcRepublicanos + this.tablaAtAGlance.promedioPorcIndependientes)/this.tablaAtAGlance.totalVotos).toFixed(2);
            
        this.tablaAtAGlance.promedioPorcDemocratas= parseFloat(this.tablaAtAGlance.cantDemocratas != 0 ? this.tablaAtAGlance.promedioPorcDemocratas/this.tablaAtAGlance.cantDemocratas : 0).toFixed(2);
    
        this.tablaAtAGlance.promedioPorcRepublicanos= parseFloat(this.tablaAtAGlance.cantRepublicanos!=0 ? this.tablaAtAGlance.promedioPorcRepublicanos/this.tablaAtAGlance.cantRepublicanos : 0).toFixed(2);

        this.tablaAtAGlance.promedioPorcIndependientes= parseFloat(this.tablaAtAGlance.cantIndependientes!=0 ? this.tablaAtAGlance.promedioPorcIndependientes/this.tablaAtAGlance.cantIndependientes : 0).toFixed(2);

    },
    cargarTabla(){

    document.getElementById("atAGlance").innerHTML = `<tr>
                    <td>Republican</td>
                    <td>${this.tablaAtAGlance.cantRepublicanos}</td>
                    <td>${this.tablaAtAGlance.promedioPorcRepublicanos} %</td>
                </tr>
                <tr>
                    <td>Democrat</td>
                    <td>${this.tablaAtAGlance.cantDemocratas}</td>
                    <td>${this.tablaAtAGlance.promedioPorcDemocratas} %</td>
                </tr>
                <tr>
                    <td>Independent</td>
                    <td>${this.tablaAtAGlance.cantIndependientes}</td>
                    <td>${this.tablaAtAGlance.promedioPorcIndependientes} %</td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td>${this.tablaAtAGlance.totalVotos}</td>
                    <td>${this.tablaAtAGlance.totalVotosPct} %</td>
                </tr>
    
                `
    
    },
	 
    },
    components: {
        static_table: {
        props: ["array", "pct", "flag", "atrib"],
        methods: {
            buscarPct(array, pct,flag,atrib){
                if(array.length === 0){
                              return
                }
                let calcular=parseInt(array.length/pct);
                let aux = flag ? [...array].sort((a,b)=> a[atrib] - b[atrib]) : [...array].sort((a,b)=> b[atrib] - a[atrib]);
                let i= calcular+1;
                let listPct=aux.slice(0,calcular);

                while(i<aux.length && listPct[calcular-1][atrib]== aux[i][atrib]){
                    listPct.push(aux[i]);
                    i++;
                }
                return listPct;
            }
        },
            template: `
                <table class="table table-active table-bordered table-striped table-sm">
                    <thead class="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Number of Missed Votes</th>
                            <th>% Missed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="value in buscarPct(array,pct, flag, atrib)" >
                            <td><a :href="value.url">{{value.last_name}}, 
                            {{value.first_name}}
                            {{value._middle_name ||""}}</a></td>
                            <td> {{atrib=="missed_votes_pct" ?  value.total_votes : value.missed_votes}}</td>
                            <td> {{value[atrib]}}</td>
                        </tr>
                        
                    </tbody>
                </table>
            `
    }
    }
})
