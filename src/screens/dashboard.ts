import { addSong } from "../utils/firebase";
import { appState, dispatch } from "../store/store";
import { addObserver } from "../store/store";
import { getSongsAction } from "../store/actions";

const song = {
    title: '',
    author: '',
    album: '',
    dateAdded: new Date(),
    duration: 0,
    img : ''
}


class Dashboard extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: 'open' });
        addObserver(this);

        //Enlazar
        this.changeTitle = this.changeTitle.bind(this);
        this.changeAuthor = this.changeAuthor.bind(this);
        this.changeAlbum = this.changeAlbum.bind(this);
        this.changeDuration = this.changeDuration.bind(this);
        this.changeImg = this.changeImg.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.render = this.render.bind(this);
    }

    async connectedCallback () {
        try {
            if (appState.songs.length === 0) {
                // Llamamos a getSongsAction y verificamos si hay canciones
                const action = await getSongsAction();
                
                // Solo ejecutamos dispatch si hay canciones
                if (action.payload && action.payload.length > 0) {
                    dispatch(action);
                    this.updateSongList();
                }
            }
            this.render();  // Renderizamos independientemente de si hay canciones o no
        } catch (error) {
            console.error("Error fetching songs:", error);
        }
    }
    changeTitle (e:any) {
        song.title = e.target.value;
    }
    changeAuthor (e:any) {
        song.author = e.target.value;
    }
    changeAlbum (e:any) {
        song.album = e.target.value;
    }
    changeDuration (e:any) {
        song.duration = e.target.value;
    }
    changeImg (e:any) {
        song.img = e.target.value;
    }

    async submitForm (e: any) {
        e.preventDefault();
        console.log(song);
        await addSong(song);
        //push el nuevo producto al estado global

        // Limpiar inputs
        this.shadowRoot?.querySelectorAll('input').forEach(input => input.value = '');

        // Recargar productos sin renderizar todo el componente
        this.updateSongList();
    }
    async updateSongList() {
        const productListContainer = this.shadowRoot?.querySelector('#product-list');
        if (productListContainer) {
            // Limpia el contenedor de la lista de productos antes de agregar nuevos
            productListContainer.innerHTML = '';
            console.log(appState.songs);

            appState.songs?.forEach((song: any) => {
                const productElement = this.ownerDocument.createElement('div');

                const title = this.ownerDocument.createElement('h2');
                title.textContent = song.title;

                const author = this.ownerDocument.createElement('p');
                author.textContent = `Autor: ${song.author}`;

                const album = this.ownerDocument.createElement('p');
                album.textContent = `Álbum: ${song.album}`;

                const duration = this.ownerDocument.createElement('p');
                duration.textContent = `Duración: ${song.duration}`;

                // Convertir la fecha de Firestore en un objeto Date
                const dateAdded = new Date(song.dateAdded.seconds * 1000);
                const formattedDate = dateAdded.toLocaleDateString(); // Puedes personalizar el formato

                const date = this.ownerDocument.createElement('p');
                date.textContent = `Añadida en: ${formattedDate}`; // Mostrar la fecha formateada


                const img = this.ownerDocument.createElement('p');
                img.textContent = `Imagen: ${song.img}`;

            

                productElement.appendChild(title);
                productElement.appendChild(author);
                productElement.appendChild(album);
                productElement.appendChild(duration);
                productElement.appendChild(date);
                productElement.appendChild(img);

                productListContainer.appendChild(productElement);
            });
        }
    }
    
    async render (){
        if (this.shadowRoot) {
            // Limpia el contenido antes de renderizar
            this.shadowRoot.innerHTML = '';

            // Formulario para crear productos
            const title = this.ownerDocument.createElement('h1');
            title.textContent = 'Canciones';
            this.shadowRoot.appendChild(title);

            const form = this.ownerDocument.createElement('form');
            this.shadowRoot.appendChild(form);

            const nameInput = this.ownerDocument.createElement('input');
            nameInput.placeholder = 'Nombre de la canción';
            nameInput.addEventListener('change', this.changeTitle);

            const priceInput = this.ownerDocument.createElement('input');
            priceInput.placeholder = 'Autor de la canción';
            priceInput.addEventListener('change', this.changeAuthor);

            const albumInput = this.ownerDocument.createElement('input');
            albumInput.placeholder = 'Album de la canción';
            albumInput.addEventListener('change', this.changeAlbum);

            const durationInput = this.ownerDocument.createElement('input');
            durationInput.placeholder = 'Duración de la canción';
            durationInput.addEventListener('change', this.changeDuration);

            const imgInput = this.ownerDocument.createElement('input');
            imgInput.placeholder = 'Imagen de la canción';
            imgInput.addEventListener('change', this.changeImg);


            const saveButton = this.ownerDocument.createElement('button');
            saveButton.textContent = 'Guardar';
            saveButton.addEventListener('click', this.submitForm);

            form.appendChild(nameInput);
            form.appendChild(priceInput);
            form.appendChild(albumInput);
            form.appendChild(durationInput);
            form.appendChild(imgInput);
            form.appendChild(saveButton);
            

            form.style.display = 'flex';
            //add gap 
            form.style.gap = '1rem';

            // Contenedor para la lista de productos
            const productListContainer = this.ownerDocument.createElement('div');
            productListContainer.id = 'product-list';
            this.shadowRoot.appendChild(productListContainer);

            // Renderiza la lista de productos inicial
            await this.updateSongList();
    
    }
}
}

customElements.define('app-dashboard', Dashboard);

export default Dashboard;