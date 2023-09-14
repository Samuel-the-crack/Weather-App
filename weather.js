const key = '2719f6a0824898780b2ee3c0b8a209ab';

const input = document.querySelector( '.search' );

async function search ()
{
    const phrase = input.value;
    const response = await fetch( `https://api.openweathermap.org/geo/1.0/direct?q=${ phrase }&appid=${ key }&limit=5` );
    const data = await response.json();
    const ulElement = document.querySelector( '.locList' );
    ulElement.innerHTML = ''
    for ( let i = 0; i < data.length; i++ )
    {
        const { name, lat, lon, country } = data[ i ];

        ulElement.innerHTML += `<li data-lat='${ lat }' data-lon='${ lon }' data-name='${ name }'>
                                    ${ name }
                                    <span>
                                        ${ country }
                                    <span>
                                </li>`;
    }
}

function debounce ( func, timeout = 300 )
{
    let timer;
    return ( ...args ) =>
    {
        clearTimeout( timer );
        timer = setTimeout( () => { func.apply( this, args ); }, timeout );
    };
}

const debouncedSearch = debounce( () => { search() }, 600 );
input.addEventListener( 'keyup', debouncedSearch );

async function showWeather ( lat, lon, name )
{
    const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${ lat }&lon=${ lon }&appid=${ key }&units=metric` );
    const data = await response.json();
    console.log( data );
    const temp = Math.round( data.main.temp );
    const feelsLike = Math.round( data.main.feels_like );
    const humidity = data.main.humidity;
    const wind = Math.round( data.wind.speed );
    const icon = data.weather[ 0 ].icon;
    document.getElementById( 'city' ).innerHTML = name;
    document.getElementById( 'windValue' ).innerHTML = wind + '<span class="value"> mph</span>';
    document.getElementById( 'feelsLikeValue' ).innerHTML = feelsLike + '<span class="value">&deg;C</span>';
    document.getElementById( 'humidityValue' ).innerHTML = humidity + '<span class="value">%</span>';
    document.getElementById( 'iconValue' ).src = `http://openweathermap.org/img/wn/${ icon }@4x.png`;
    document.getElementById( 'temper' ).innerHTML = temp + '&deg;C';
    document.querySelector( 'form' ).style.display = 'none';
    document.getElementById( 'weather' ).style.display = 'block';
}

document.body.addEventListener( 'click', ev =>
{
    const li = ev.target;
    const { lat, lon, name } = li.dataset;
    localStorage.setItem( 'lat', lat );
    localStorage.setItem( 'lon', lon );
    localStorage.setItem( 'name', name );
    if ( !lat )
    {
        return;
    }
    showWeather( lat, lon, name )
} );

document.getElementById( 'change' ).addEventListener( 'click', () =>
{
    document.querySelector( 'form' ).style.display = 'block';
    document.getElementById( 'weather' ).style.display = 'none';
} );

document.body.onload = () =>
{
    if ( localStorage.getItem( 'lat' ) )
    {
        const lat = localStorage.getItem( 'lat' );
        const lon = localStorage.getItem( 'lon' );
        const name = localStorage.getItem( 'name' );
        showWeather( lat, lon, name );
    }
}