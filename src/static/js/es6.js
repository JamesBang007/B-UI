//函数默认参数 es5
function showEs5( a, b ) {
    a = a || '欢迎';
    b = b || 'mmr';
    console.log( a, b );
}
showEs5( 'welcome', '前端人' );
showEs5( 'welcome' );
showEs5( '', '前端人' );

//函数默认参数 es6
function show( a = "欢迎", b = "前端人" ) {
    console.log( a, b );
}
show( "welcome", "James邦" );
show( "welcome" );