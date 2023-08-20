export class GitHubUser{
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data =>data.json())
        .then(({login, name, public_repos,followers}) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}

export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
        //GitHubUser.search('paulobraga91').then(user => console.log(user))
        
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

   async add(username){
    
    try{
        const userExists = this.entries.find(entry => entry.login === username)
        if (userExists){
            throw new Error('Usuário já cadastrado')
        }
        
        
        const user = await GitHubUser.search(username)
    if (user.login === undefined){
        throw new Error('User not found')
    }

        this.entries = [user, ...this.entries]
        this.update()
        this.save()

    }catch(error){
        alert(error.message)
    }  
    }


    delete(user){
        const filteredEntries = this.entries.
        filter(entry => entry.login !== user.login)
        this.entries = filteredEntries
        this.update()
        this.save()
   }

}

export class FavoritesView extends Favorites{
    constructor(root){
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
        this.onadd()
    }

    onadd(){

        const buttondd = this.root.querySelector('.search button')
        buttondd.onclick=() =>{
            const {value} = this.root.querySelector('.search input')
            this.add(value) 
            this.root.querySelector('.search input').textContent = ""
        }
            
    }

    update(){
      this.removeAlltr()
      
      this.entries.forEach(user => {
        const row = this.createRow()
        row.querySelector('.users img').src = `https://github.com/${user.login}.png`
        row.querySelector('.users p').textContent = user.name
        row.querySelector('.users a').href = `https://github.com/${user.login}`
        row.querySelector('.users span').textContent = user.login
        row.querySelector('.repositories').textContent = user.public_repos
        row.querySelector('.followers').textContent = user.followers
        row.querySelector('.remove').onclick = () =>{
            const isOk = confirm('Tem certeza que deseja excluir a linha?')
            if(isOk){
                this.delete(user)
            }
        }
        
        this.tbody.append(row)
    }) 
    }


    createRow(){
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td class="users">
            <img src="https://github.com/paulobraga91.png" alt="">
            <a href="www.github.com/paulobraga91" target="_blank">
                <p>Paulo Braga</p>
                <span>paulobraga91</span></a>
            </td>
        <td class="repositories">13</td>
        <td class="followers">1505</td>
        <td>
            <button class="remove">&times;</button>
        </td>
    `   
        return tr
    }
    removeAlltr(){
        const tbody = this.root.querySelector('table tbody')
       this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        })
    }
}