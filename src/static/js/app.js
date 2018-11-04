//请求头
var postHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

//获取url参数
function formatSearch( se ) {
    if ( typeof se !== "undefined" ) {
        se = se.substr( 1 );
        var arr = se.split( "&" ),
            obj = {},
            newarr = [];
        arr.forEach( function ( v, i ) {
            newarr = v.split( "=" );
            if ( typeof obj[ newarr[ 0 ] ] === "undefined" ) {
                obj[ newarr[ 0 ] ] = newarr[ 1 ];
            }
        } );
        return obj;
    };
}
//获取请求参数
var search = formatSearch( location.search );

//天数差
function getDay_num( before, after ) {
    var before = new Date( before ); //创建 Date 对象
    var after = new Date( after );
    var days = parseInt( ( after - before ) / ( 24 * 60 * 60 * 1000 ) );
    return days;
}

//time返回 x月x日
function getMonthDay( time ) {
    var myTime = new Date( time );
    var iMonth = myTime.getMonth() + 1;
    var iDay = myTime.getDate();
    return iMonth + '月' + iDay + '日';
}
//time返回x年x月x日
function getYearMonthDay( time ) {
    var myTime = new Date( time );
    var iYear = myTime.getFullYear();
    var iMonth = myTime.getMonth() + 1;
    var iDay = myTime.getDate();
    return iYear + '年' + iMonth + '月' + iDay + '日';
}

//上拉触底请求加载
function loadMore( el, fun, loading ) {
    loading = loading ? loading : true;
    var wh = $( window ).height();
    //滚动
    $( window ).scroll( function () {
        var wt = $( window ).scrollTop();
        var lt = $( el ).offset().top;
        //&& !vList.loading && vList.more
        if ( wt + wh + 20 > lt && loading ) {
            //console.log( wt+wh );
            fun(); //请求加载
        }
    } );
}

//Swiper点击图片相册预览
function imgPreview( imgList, index ) {
    var mySwiper = new Swiper( '.swiper-container', {
        width: window.innerWidth,
        zoom: true,
        virtual: true, //开启虚拟Slide功能
        spaceBetween: 10,
        centeredSlides: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
    } );

    imgList.forEach( function ( v, i ) {
        mySwiper.virtual.appendSlide( '<div class="swiper-zoom-container"><img src="' + v + '" /></div>' );
    } );
    mySwiper.slideTo( index );
    mySwiper.virtual.update();
    $( '#img-preview' ).fadeIn( 'fast' );

    $( '.swiper-close' ).click( function () {
        $( '#img-preview' ).fadeOut( 'fast' );
        mySwiper.virtual.slides.length = 0;
        mySwiper.virtual.cache = [];
    } );
}

//倒计时
function countdown( time ) {
    var currentTime = new Date();
    var endTime = new Date( time.replace( /-/g, "/" ) );
    var t = Math.floor( ( endTime - currentTime ) / 1000 );
    var str = '';
    if ( t > 0 ) {
        //str = Math.floor(t/86400)+'天'+Math.floor(t%86400/3600)+'时'+Math.floor(t%86400%3600/60)+'分'+t%60+'秒';
        str = Math.floor( t / 3600 ) + ':' + ( Math.floor( t % 86400 % 3600 / 60 ) > 9 ? Math.floor( t % 86400 % 3600 / 60 ) : '0' + Math.floor( t % 86400 % 3600 / 60 ) ) + ':' + ( t % 60 > 9 ? t % 60 : '0' + t % 60 );
    }
    return str;
}

//是否在微信内置浏览器中
function isInWx() {
    var agent = window.navigator.userAgent.toLowerCase();
    return agent.match( /MicroMessenger/i ) == 'micromessenger';
}

//是否在微博内置浏览器中
function isInWb() {
    var agent = window.navigator.userAgent.toLowerCase();
    return agent.match( /WeiBo/i ) == 'weibo';
}

//Ios客户端判断
function isInIos() {
    var userAgentInfo = navigator.userAgent,
        Agents = [ "iPhone", "iPad", "iPod" ];
    for ( var v = 0; v < Agents.length; v++ ) {
        if ( userAgentInfo.indexOf( Agents[ v ] ) > 0 ) {
            return true;
        }
    }
    return false;
}

//Android客户端判断
function isInAndroid() {
    var userAgentInfo = navigator.userAgent,
        Agents = [ "Android", "Linux" ];
    for ( var v = 0; v < Agents.length; v++ ) {
        if ( userAgentInfo.indexOf( Agents[ v ] ) > 0 ) {
            return true;
        }
    }
    return false;
}

//消息提示
function message( that, str ) {
    that.message = {
        "text": str,
        "show": true
    };
    setTimeout( function () {
        that.message.show = false;
    }, 1500 );
}

//微信分享
function wxShare( shareUrl, shareData ) {
    $.ajax( {
        type: 'GET',
        //url: base +'/Wechatjs/getSignPackage',
        url: base_h5 + '/wechat/config.php',
        data: {
            url: shareUrl
        },
        dataType: 'json',
        headers: postHeaders,
        success: function ( res ) {
            console.log( res );
            wechatJS( res );
        },
        error: function ( err ) {
            console.log( '请求失败：' );
        }
    } );

    function wechatJS( res ) {
        //注入权限验证配置
        wx.config( {
            //debug: true,
            appId: res.appId,
            timestamp: res.timestamp,
            nonceStr: res.nonceStr,
            signature: res.signature,
            jsApiList: [
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ]
        } );
        //处理config信息成功验证
        wx.ready( function () {
            // 在这里调用 API
            //console.log('config信息成功');
            //分享给朋友
            wx.onMenuShareAppMessage( {
                title: shareData.title,
                desc: shareData.desc,
                link: shareUrl,
                imgUrl: shareData.image,
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    // 用户点击了分享后执行的回调函数
                    // console.log('点击了分享');
                },
                fail: function ( res ) {
                    // 失败
                    alert( JSON.stringify( res ) );
                }
            } );
            //分享到朋友圈
            wx.onMenuShareTimeline( {
                title: shareData.title,
                link: shareUrl,
                imgUrl: shareData.image,
                success: function () {
                    // 用户点击了分享后执行的回调函数
                },
            } );
        } );
        //处理config信息失败验证
        wx.error( function () {
            // 在这里调用 API
            // console.log('config信息失败');
        } );
    }
}

//微博登录，获取用户信息
function getWBUserInfo( callback ) {
    WB2.login( function () {
        //入口函数
        WB2.anyWhere( function ( W ) {
            //数据交互，获取uid
            W.parseCMD( '/account/get_uid.json', function ( res, b ) {
                if ( b ) {
                    //console.log(res);
                    getUsers( W, res );
                } else {
                    alert( "授权失败或错误" );
                }
            }, {}, {
                method: 'get'
            } );
        } );
    } );

    function getUsers( W, R ) {
        //数据交互，获取用户信息
        W.parseCMD( '/users/show.json', function ( res, b ) {
            if ( b && callback ) {
                callback.call( this, res );
            } else {
                alert( "授权失败或错误" );
            }
        }, {
            'uid': R.uid
        }, {
            method: 'get'
        } );
    }
}

// 生成随机数
function getRandomNum( Min, Max ) {
    var Range = Max - Min;
    var Rand = Math.random();
    return ( Min + Math.round( Rand * Range ) );
}

//APP版本号字符串转数字
function str2num( value ) {
    var arr = value.split( '.' ); //字符串分割为数组
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[ i ] < 10 ) {
            arr[ i ] = "0" + arr[ i ];
        }
    }
    return Number( arr.join( '' ) ); //数组放入字符串 ,然后转数字
}
