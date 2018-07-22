(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{1123:function(e,t,a){"use strict";(function(t){var n=d(a(54)),s=d(a(55)),r=d(a(67)),i=d(a(56)),l=d(a(57)),c=a(47),o=d(c),u=d(a(68));function d(e){return e&&e.__esModule?e:{default:e}}var f=function(e){function a(e){(0,s.default)(this,a);var t=(0,i.default)(this,(a.__proto__||(0,n.default)(a)).call(this,e));return t.subscription=null,t.state={status:!1,name:null},t}return(0,l.default)(a,e),(0,r.default)(a,[{key:"handleConfig",value:function(){t("#configurationModal").modal()}},{key:"onUpdate",value:function(e){this.setState(function(t){return{status:e,name:e.name}})}},{key:"componentDidMount",value:function(){this.subscription=u.default.networkStatusStream.subscribe(this.onUpdate.bind(this))}},{key:"componentWillUnmount",value:function(){null!==this.subscription&&this.subscription.unsubscribe()}},{key:"render",value:function(){return o.default.createElement("button",{className:"btn btn-dark btn-outline-light",onClick:this.handleConfig.bind(this)},o.default.createElement("span",{style:{color:!1!==this.state.status?u.default.web3.eth.defaultAccount?"#6f6":"#ffa500":"#f66"}},o.default.createElement("i",{className:"fas fa-signal"}))," ",o.default.createElement("span",null,this.state.name))}}]),a}(c.Component);e.exports=f}).call(this,a(0))},1127:function(e,t,a){"use strict";var n=m(a(1128)),s=m(a(92)),r=m(a(54)),i=m(a(55)),l=m(a(67)),c=m(a(56)),o=m(a(57)),u=a(47),d=m(u),f=m(a(68)),h=m(a(96));function m(e){return e&&e.__esModule?e:{default:e}}var p=function(e){function t(e){(0,i.default)(this,t);var a=(0,c.default)(this,(t.__proto__||(0,r.default)(t)).call(this,e));return a.subscription=null,a.state={account:"-",balance:0,unclaimed:0,disabled:!1},a}return(0,o.default)(t,e),(0,l.default)(t,[{key:"onUpdate",value:function(e){this.setState(function(t){var a=f.default.web3;return e.balance=a.fromWei(e.balance,"ether"),e.unclaimed=a.fromWei(e.unclaimed,"ether"),e})}},{key:"componentDidMount",value:function(){this.subscription=f.default.accountUpdateStream.subscribe(this.onUpdate.bind(this))}},{key:"componentWillUnmount",value:function(){null!==this.subscription&&this.subscription.unsubscribe()}},{key:"handleWithdraw",value:function(){var e=this;this.setState(function(e){return(0,s.default)({},e,{disabled:!0})}),f.default.withdraw().then(function(t,a){h.default.notice("Successfully withdrew your unclaimed funds."),e.setState(function(e){return(0,s.default)({},e,{disabled:!1})})}).catch(function(t){return e.setState(function(e){return(0,s.default)({},e,{disabled:!1})})})}},{key:"render",value:function(){return d.default.createElement("div",null,d.default.createElement("div",{style:{overflow:"hidden",textOverflow:"ellipsis"}},d.default.createElement("strong",null,"Account:"),d.default.createElement("br",null),this.state.account||"-"),d.default.createElement("div",{className:"mt-1"},d.default.createElement("strong",null,"Balance:"),d.default.createElement("br",null),d.default.createElement("i",{className:"fab fa-ethereum"})," ",(0,n.default)(this.state.balance).toPrecision(5)," ",d.default.createElement("small",{className:"text-muted"},"(",d.default.createElement("i",{className:"fab fa-ethereum"})," ",(0,n.default)(this.state.unclaimed).toPrecision(3)," unclaimed)")," ",this.state.unclaimed>0&&d.default.createElement("button",{onClick:this.handleWithdraw.bind(this),disabled:this.state.disabled,className:"btn btn-primary btn-sm"},d.default.createElement("i",{className:this.state.disabled?"fas fa-sync fa-spin":"fas fa-hand-holding-usd"})," Withdraw")))}}]),t}(u.Component);e.exports=p},1133:function(e,t,a){"use strict";var n=m(a(92)),s=m(a(54)),r=m(a(55)),i=m(a(67)),l=m(a(56)),c=m(a(57)),o=a(47),u=m(o),d=m(a(287)),f=m(a(68)),h=m(a(96));function m(e){return e&&e.__esModule?e:{default:e}}a(496);var p=function(e){function t(e){(0,r.default)(this,t);var a=(0,l.default)(this,(t.__proto__||(0,s.default)(t)).call(this,e));return a.state={receiptionCode:"",disabled:!1,buttonDisabled:!0},a}return(0,c.default)(t,e),(0,i.default)(t,[{key:"render",value:function(){return u.default.createElement("form",{onSubmit:this.handleSubmit.bind(this)},u.default.createElement(d.default,{disabled:this.state.disabled,onChange:this.handleReceiptionCode.bind(this),name:"parcelFromAddress",placeholder:"Confirmation code",value:this.state.receiptionCode}),u.default.createElement("button",{className:"btn btn-primary",disabled:this.state.buttonDisabled},u.default.createElement("i",{className:this.state.disabled?"fas fa-sync fa-spin":"fas fa-box"})," Confirm"))}},{key:"handleReceiptionCode",value:function(e){e=e.substr(0,8).replace(/[^a-f0-9]/i,""),this.setState(function(t){return(0,n.default)({},t,{receiptionCode:e,buttonDisabled:8!=e.length})})}},{key:"handleSubmit",value:function(e){var t=this;e.preventDefault(),this.setState((0,n.default)({},this.state,{disabled:!0})),f.default.deliverParcel(this.state.receiptionCode).then(function(e){t.setState({receiptionCode:"",disabled:!1}),h.default.notice("Thanks for confirming the parcel.")}).catch(function(e){h.default.alert("Confirming the parcel failed. Maybe you have to verify your code or the receiption has been confirmed already."),t.setState((0,n.default)({},t.state,{disabled:!1}))})}}]),t}(o.Component);e.exports=p},1135:function(e,t,a){"use strict";(function(t,n){var s=b(a(215)),r=b(a(92)),i=b(a(54)),l=b(a(55)),c=b(a(67)),o=b(a(56)),u=b(a(57)),d=a(47),f=b(d),h=b(a(287)),m=b(a(68)),p=b(a(96));function b(e){return e&&e.__esModule?e:{default:e}}a(496);var v=function(e){function a(e){(0,l.default)(this,a);var t=(0,o.default)(this,(a.__proto__||(0,i.default)(a)).call(this,e));return t.submitStream=null,t.cleanState={fromAddress:"",from3Words:"",toAddress:"",to3Words:"",weight:"",price:"",maxPrice:"",disabled:!1},t.state=(0,r.default)({},t.cleanState),t.handleSubmit=t.handleSubmit.bind(t),t.handleFromAddress=t.handleFromAddress.bind(t),t.handleFrom3Words=t.handleFrom3Words.bind(t),t.handleToAddress=t.handleToAddress.bind(t),t.handleTo3Words=t.handleTo3Words.bind(t),t.handleWeight=t.handleWeight.bind(t),t.handlePrice=t.handlePrice.bind(t),t}return(0,u.default)(a,e),(0,c.default)(a,[{key:"render",value:function(){return f.default.createElement("form",{onSubmit:this.handleSubmit},f.default.createElement(h.default,{disabled:this.state.disabled,onChange:this.handleFromAddress,name:"parcelFromAddress",fieldLabel:"Pick up at address",placeholder:"John Doe, Somestreet, 94743 Example",value:this.state.fromAddress}),f.default.createElement(h.default,{disabled:this.state.disabled,onChange:this.handleFrom3Words,help3Words:"Find the 3 words address",name:"parcelFrom3Words",fieldLabel:"Pick up 3 words address",placeholder:"///...",value:this.state.from3Words}),f.default.createElement(h.default,{disabled:this.state.disabled,onChange:this.handleToAddress,name:"parcelToAddress",fieldLabel:"Send to address",placeholder:"Jane Doe, Otherstreet, 94743 Example",value:this.state.toAddress}),f.default.createElement(h.default,{disabled:this.state.disabled,onChange:this.handleTo3Words,help3Words:"Find the 3 words address",name:"parcelTo3Words",fieldLabel:"Pick up 3 words address",placeholder:"///...",value:this.state.to3Words}),f.default.createElement(h.default,{disabled:this.state.disabled,onChange:this.handleWeight,name:"parcelWeight",fieldLabel:"Weight in kg",value:this.state.weight}),f.default.createElement(h.default,{maxValue:this.state.maxValue,disabled:this.state.disabled,onChange:this.handlePrice,name:"parcelPrice",fieldLabel:"Compensation in Ether",value:this.state.price}),f.default.createElement("button",{className:"btn btn-primary",disabled:this.state.disabled},f.default.createElement("i",{className:this.state.disabled?"fas fa-sync fa-spin":"fas fa-box"})," Create offer"),f.default.createElement("hr",null))}},{key:"componentDidMount",value:function(){var e=this,t=m.default.web3;m.default.readyContracts().then(function(a){m.default.getMaxValue().then(function(a){return e.setState((0,r.default)({},e.state,{maxValue:t.fromWei(a,"ether")}))})})}},{key:"handleFromAddress",value:function(e){this.setState((0,r.default)({},this.state,{fromAddress:e}))}},{key:"handleFrom3Words",value:function(e){this.setState((0,r.default)({},this.state,{from3Words:e}))}},{key:"handleToAddress",value:function(e){this.setState((0,r.default)({},this.state,{toAddress:e}))}},{key:"handleTo3Words",value:function(e){this.setState((0,r.default)({},this.state,{to3Words:e}))}},{key:"handleWeight",value:function(e){e=e.replace(/[^0-9\.]*/,""),this.setState((0,r.default)({},this.state,{weight:e}))}},{key:"handlePrice",value:function(e){e=e.replace(/[^0-9\.]*/,""),parseFloat(e)>this.state.maxValue&&(e=this.state.maxValue),this.setState((0,r.default)({},this.state,{price:e}))}},{key:"handleSubmit",value:function(e){var a=this;if(e.preventDefault(),this.state.fromAddress&&this.state.toAddress&&this.state.weight&&this.state.price){var i=m.default.web3,l=(0,s.default)({fromAddress:this.state.fromAddress,from3Words:this.state.from3Words,toAddress:this.state.toAddress,to3Words:this.state.to3Words,weight:this.state.weight,nonce:Math.random()});this.setState((0,r.default)({},this.state,{disabled:!0}));var c=i.sha3(l).substring(2,10),o=i.sha3(c),u=t.from(l);m.default.ipfs.add(u,{pin:!0}).then(function(e){var t=(0,s.default)({hash:e[0].hash});m.default.createParcel(o,t,i.toWei(a.state.price,"ether")).then(function(){var e=n("#confirmationCodeModal");n("#confirmationCode",e).text(c),p.default.notice("The offer has been published."),e.modal(),a.setState((0,r.default)({},a.cleanState))}).catch(function(e){p.default.alert("Could not create the offer."),a.setState((0,r.default)({},a.state,{disabled:!1}))})}).catch(function(e){console.log(e)})}}}]),a}(d.Component);e.exports=v}).call(this,a(8).Buffer,a(0))},1136:function(e,t,a){"use strict";var n=w(a(299)),s=w(a(92)),r=w(a(300)),i=w(a(216)),l=w(a(215)),c=w(a(54)),o=w(a(55)),u=w(a(67)),d=w(a(56)),f=w(a(57)),h=w(a(325)),m=w(a(497)),p=a(47),b=w(p),v=w(a(1139)),k=w(a(68)),g=a(288),E=a(498);function w(e){return e&&e.__esModule?e:{default:e}}var y=(0,m.default)({CREATED:(0,h.default)("list_created"),MINE:(0,h.default)("list_mine"),TAKEN:(0,h.default)("list_taken")}),S="btn btn-secondary",C="btn btn-outline-secondary",A=function(e){function t(e){(0,o.default)(this,t);var a=(0,d.default)(this,(t.__proto__||(0,c.default)(t)).call(this,e));return a.state={listType:y.CREATED,className:{created:S,mine:C,taken:C},parcels:[]},a}return(0,f.default)(t,e),(0,u.default)(t,[{key:"componentDidMount",value:function(){var e=this;this.doUpdate().then(function(t){var a=k.default.web3;(0,g.merge)(k.default.updateStream,k.default.accountUpdateStream).pipe((0,E.map)(function(e){return a.sha3((0,l.default)(e))})).pipe((0,E.distinctUntilChanged)()).pipe((0,E.throttleTime)(1e3)).subscribe(e.doUpdate.bind(e))})}},{key:"doUpdate",value:function(){var e=this;return new i.default(function(t,a){k.default.readyContracts().then(function(){var a=(0,r.default)(n.default.mark(function a(r){var i,l,c,o;return n.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:i=void 0,a.t0=e.state.listType,a.next=a.t0===y.MINE?4:a.t0===y.TAKEN?8:12;break;case 4:return a.next=6,k.default.getMyParcels();case 6:return i=a.sent,a.abrupt("break",16);case 8:return a.next=10,k.default.getTakenParcels();case 10:return i=a.sent,a.abrupt("break",16);case 12:return a.next=14,k.default.getParcels();case 14:return i=a.sent,a.abrupt("break",16);case 16:for(i||(i=[]),l=0,c=function(t){i[t].loading=!0;var a=i[t];k.default.getParcel(a.confirmationHash).then(function(a){a.loading=!1,i[t]=a,++l==i.length&&e.setState((0,s.default)({},e.state,{parcels:i}))})},o=0;o<i.length;o++)c(o);e.setState((0,s.default)({},e.state,{parcels:i})),t();case 22:case"end":return a.stop()}},a,e)}));return function(e){return a.apply(this,arguments)}}())})}},{key:"onSelectCreated",value:function(){this.setState((0,s.default)({},this.state,{listType:y.CREATED,className:{created:S,mine:C,taken:C}})),this.doUpdate()}},{key:"onSelectMine",value:function(){this.setState((0,s.default)({},this.state,{listType:y.MINE,className:{created:C,mine:S,taken:C}})),this.doUpdate()}},{key:"onSelectTaken",value:function(){this.setState((0,s.default)({},this.state,{listType:y.TAKEN,className:{created:C,mine:C,taken:S}})),this.doUpdate()}},{key:"render",value:function(){return b.default.createElement("div",null,b.default.createElement("div",{className:"row mb-2"},b.default.createElement("div",{className:"col"},b.default.createElement("h3",null,"Pick and deliver a parcel")),b.default.createElement("div",{className:"col text-right"},b.default.createElement("div",{className:"btn-group btn-group-sm",role:"group","aria-label":"Select list type"},b.default.createElement("button",{onClick:this.onSelectCreated.bind(this),type:"button",className:this.state.className.created},"All available"),b.default.createElement("button",{onClick:this.onSelectMine.bind(this),type:"button",className:this.state.className.mine},"My parcels"),b.default.createElement("button",{onClick:this.onSelectTaken.bind(this),type:"button",className:this.state.className.taken},"To deliver")))),b.default.createElement("div",{className:"row"},this.state.parcels.map(function(e){return b.default.createElement(v.default,{key:e.confirmationHash,confirmationHash:e.confirmationHash,state:e.state,senderAddress:e.senderAddress,fromAddress:e.fromAddress,from3Words:e.from3Words,toAddress:e.toAddress,to3Words:e.to3Words,weight:e.weight,loading:e.loading,price:e.price})})),b.default.createElement("hr",null))}}]),t}(p.Component);e.exports=A},1139:function(e,t,a){"use strict";var n=h(a(54)),s=h(a(55)),r=h(a(67)),i=h(a(56)),l=h(a(57)),c=h(a(497)),o=a(47),u=h(o),d=h(a(68)),f=h(a(96));function h(e){return e&&e.__esModule?e:{default:e}}var m=(0,c.default)({CREATED:0,TAKEN:1,PICKED_UP:2,DELIVERED:3,CANCELLED:4}),p=function(e){function t(e){(0,s.default)(this,t);var a=(0,i.default)(this,(t.__proto__||(0,n.default)(t)).call(this,e));return a.state={disabled:!1},a}return(0,l.default)(t,e),(0,r.default)(t,[{key:"render",value:function(){var e=d.default.web3;return u.default.createElement("div",{className:"col-md-4 mb-3"},u.default.createElement("div",{className:"border rounded shadow p-2"},u.default.createElement("div",{className:"row"},u.default.createElement("div",{className:"col"},u.default.createElement("strong",null,"From:")," ",this.props.fromAddress||"-"," ",this.props.from3Words&&u.default.createElement("a",{title:this.props.from3Words,href:"https://map.what3words.com/"+this.props.from3Words.replace(/\/*/,""),target:"_blank"},u.default.createElement("img",{src:"images/what3words.png",style:{width:"16px"},alt:this.props.from3Words})))),u.default.createElement("div",{className:"row"},u.default.createElement("div",{className:"col"},u.default.createElement("strong",null,"To:")," ",this.props.toAddress||"-"," ",this.props.to3Words&&u.default.createElement("a",{title:this.props.to3Words,href:"https://map.what3words.com/"+this.props.to3Words.replace(/\/*/,""),target:"_blank"},u.default.createElement("img",{src:"images/what3words.png",style:{width:"16px"},alt:this.props.to3Words})))),u.default.createElement("div",{className:"row"},u.default.createElement("div",{className:"col"},u.default.createElement("strong",null,"Weight:")," ",this.props.weight||"0","kg")),u.default.createElement("hr",null),u.default.createElement("div",{className:"row"},this.props.senderAddress&&this.props.state==m.PICKED_UP&&u.default.createElement("div",{className:"col"},u.default.createElement("i",{className:"fas fa-shipping-fast"})),this.props.senderAddress&&this.props.state==m.DELIVERED&&u.default.createElement("div",{className:"col"},u.default.createElement("i",{className:"fas fa-parachute-box"})),this.props.senderAddress&&!!d.default.account.account&&this.props.senderAddress!=d.default.account.account&&this.props.state==m.CREATED&&u.default.createElement("div",{className:"col"},u.default.createElement("button",{onClick:this.handleTake.bind(this),disabled:this.state.disabled,className:"btn btn-sm btn-secondary"},u.default.createElement("i",{className:this.state.disabled?"fas fa-sync fa-spin":"fas fa-shipping-fast"})," Take")),this.props.senderAddress&&!!d.default.account.account&&this.props.senderAddress==d.default.account.account&&this.props.state==m.CREATED&&u.default.createElement("div",{className:"col"},u.default.createElement("button",{onClick:this.handleCancel.bind(this),disabled:this.state.disabled,className:"btn btn-sm btn-danger"},u.default.createElement("i",{className:this.state.disabled?"fas fa-sync fa-spin":"fas fa-ban"})," Cancel")),this.props.senderAddress&&!!d.default.account.account&&this.props.senderAddress==d.default.account.account&&this.props.state==m.TAKEN&&u.default.createElement("div",{className:"col"},u.default.createElement("button",{onClick:this.handlePickUp.bind(this),disabled:this.state.disabled,className:"btn btn-sm btn-primary"},u.default.createElement("i",{className:this.state.disabled?"fas fa-sync fa-spin":"fas fa-truck"})," Picked up")),u.default.createElement("div",{className:"col text-right"},this.props.confirmationHash&&this.props.loading&&u.default.createElement("span",null,u.default.createElement("i",{className:"fas fa-sync fa-spin"})," "),u.default.createElement("i",{className:"fab fa-ethereum"}),u.default.createElement("strong",null," ",e.fromWei(this.props.price,"ether")||"0")))))}},{key:"handleTake",value:function(){var e=this;this.setState({disabled:!0}),d.default.takeParcel(this.props.confirmationHash).then(function(t){f.default.notice("You took this offer. Please contact the sender to clarify the details."),e.setState({disabled:!1})}).catch(function(t){return e.setState({disabled:!1})})}},{key:"handlePickUp",value:function(){var e=this;this.setState({disabled:!0}),d.default.pickUpParcel(this.props.confirmationHash).then(function(t){f.default.notice("The parcel has been picked up."),e.setState({disabled:!1})}).catch(function(t){return e.setState({disabled:!1})})}},{key:"handleCancel",value:function(){var e=this;this.setState({disabled:!0}),d.default.cancelParcel(this.props.confirmationHash).then(function(t){f.default.notice("The offer has been cancelled."),e.setState({disabled:!1})}).catch(function(t){return e.setState({disabled:!1})})}}]),t}(o.Component);e.exports=p},1140:function(e,t,a){"use strict";var n=d(a(54)),s=d(a(55)),r=d(a(67)),i=d(a(56)),l=d(a(57)),c=a(47),o=d(c),u=d(a(96));function d(e){return e&&e.__esModule?e:{default:e}}var f=function(e){function t(e){(0,s.default)(this,t);var a=(0,i.default)(this,(t.__proto__||(0,n.default)(t)).call(this,e));return a.timeout=null,a.subscription=null,a.state={message:null,alert:!1,visible:!1},a}return(0,l.default)(t,e),(0,r.default)(t,[{key:"componentDidMount",value:function(){this.subscription=u.default.getMessageStream().subscribe(this.onUpdate.bind(this))}},{key:"componentWillUnmount",value:function(){null!==this.subscription&&this.subscription.unsubscribe()}},{key:"handleClick",value:function(){this.setState({message:null,alert:!1,visible:!1})}},{key:"onUpdate",value:function(e){this.setState(e),null!==this.timeout&&clearTimeout(this.timeout),this.timeout=setTimeout(this.handleClick.bind(this),15e3)}},{key:"render",value:function(){return o.default.createElement("div",null,this.state.visible&&!!this.state.message&&o.default.createElement("div",{onClick:this.handleClick.bind(this),className:this.state.alert?"alert alert-danger mt-4":"alert alert-success mt-4",role:"alert",style:{cursor:"pointer"}},this.state.message))}}]),t}(c.Component);e.exports=f},1141:function(e,t,a){"use strict";(function(t){var n=h(a(92)),s=h(a(54)),r=h(a(55)),i=h(a(67)),l=h(a(56)),c=h(a(57)),o=a(47),u=h(o),d=h(a(287)),f=h(a(68));function h(e){return e&&e.__esModule?e:{default:e}}var m=function(e){function a(e){(0,r.default)(this,a);var t=(0,l.default)(this,(a.__proto__||(0,s.default)(a)).call(this,e));return t.subscription=null,t.state={disabled:!1,ipfsAddress:e.ipfsAddress||f.default.connectionData.ipfsAddress,nodeAddress:e.nodeAddress||f.default.connectionData.nodeAddress,account:e.account||f.default.connectionData.account,isMetaMask:!1,isTrust:!1,isToshi:!1,isCipher:!1,isConnected:!1},t}return(0,c.default)(a,e),(0,i.default)(a,[{key:"componentDidMount",value:function(){var e=this;t("#configurationModal").on("hidden.bs.modal",function(t){e.isAddress(e.state.account)||e.setState(function(e){return(0,n.default)({},e,{account:""})}),f.default.connectionData.account=e.state.account,f.default.connectionData.ipfsAddress=e.state.ipfsAddress||"https://ipfs.infura.io:5001/",f.default.connectionData.nodeAddress=e.state.nodeAddress||"https://localhost:8545/",f.default.reconnect()}),this.subscription=f.default.networkStatusStream.subscribe(function(t){var a=f.default.web3;e.setState(function(e){return(0,n.default)({},e,{isMetaMask:!!a.currentProvider.isMetaMask,isTrust:!!a.currentProvider.isTrust,isToshi:void 0!==window.SOFA,isCypher:void 0!==window.__CIPHER__,isConnected:!!t.name,hasAccount:!!a.eth.defaultAccount,network:t.name})})})}},{key:"componentWillUnmount",value:function(){null!==this.subscription&&this.subscription.unsubscribe()}},{key:"handleIpfsAddress",value:function(e){this.setState(function(t){return(0,n.default)({},t,{ipfsAddress:e})})}},{key:"handleNodeAddress",value:function(e){this.setState(function(t){return(0,n.default)({},t,{nodeAddress:e})})}},{key:"handleAccount",value:function(e){this.setState(function(t){return(0,n.default)({},t,{account:e.toLowerCase()})})}},{key:"handleSubmit",value:function(e){e.preventDefault()}},{key:"isAddress",value:function(e){return!!/^(0x)?[0-9a-f]{40}$/i.test(e)&&(!(!/^(0x)?[0-9a-f]{40}$/.test(e)&&!/^(0x)?[0-9A-F]{40}$/.test(e))||this.isChecksumAddress(e))}},{key:"isChecksumAddress",value:function(e){e=e.replace("0x","");for(var t=sha3(e.toLowerCase()),a=0;a<40;a++)if(parseInt(t[a],16)>7&&e[a].toUpperCase()!==e[a]||parseInt(t[a],16)<=7&&e[a].toLowerCase()!==e[a])return!1;return!0}},{key:"render",value:function(){return u.default.createElement("form",{onSubmit:this.handleSubmit.bind(this)},u.default.createElement("div",{className:"modal-body"},this.state.isMetaMask&&u.default.createElement("div",{className:"row"},u.default.createElement("div",{className:"col"},u.default.createElement("img",{src:"images/metamask.svg",width:"40"})," ",u.default.createElement("span",{style:{color:!1!==this.state.hasAccount?"#6f6":"#f66"}},u.default.createElement("i",{className:"fas fa-signal"}))," ",this.state.hasAccount&&"Connected using Metamask",!this.state.hasAccount&&"Please unlock Metamask.",u.default.createElement("hr",null))),this.state.isToshi&&u.default.createElement("div",{className:"row"},u.default.createElement("div",{className:"col"},u.default.createElement("img",{src:"images/toshi.png",width:"40"})," ",u.default.createElement("span",{style:{color:!1!==this.state.hasAccount?"#6f6":"#f66"}},u.default.createElement("i",{className:"fas fa-signal"}))," ",this.state.hasAccount&&"Connected using Toshi",u.default.createElement("hr",null))),this.state.isCipher&&u.default.createElement("div",{className:"row"},u.default.createElement("div",{className:"col"},u.default.createElement("span",{style:{color:!1!==this.state.hasAccount?"#6f6":"#f66"}},u.default.createElement("i",{className:"fas fa-signal"}))," ",this.state.hasAccount&&"Connected using Cipher",u.default.createElement("hr",null))),!this.state.isMetaMask&&!this.state.isToshi&&!this.state.isCipher&&u.default.createElement("div",{className:"row"},u.default.createElement("div",{className:"col"},u.default.createElement("span",{style:{color:!1!==this.state.isConnected?"#6f6":"#f66"}},u.default.createElement("i",{className:"fas fa-signal"}))," ",this.state.isConnected&&"Connected to "+this.state.network+" network",this.state.isConnected&&!this.state.hasAccount&&" but no account available.",!this.state.isConnected&&"Not connected.",u.default.createElement("hr",null),u.default.createElement(d.default,{disabled:this.state.disabled,onChange:this.handleNodeAddress.bind(this),name:"nodeAddress",fieldLabel:"Ethereum Node URL",placeholder:"http://localhost:8545/",value:this.state.nodeAddress}),u.default.createElement(d.default,{disabled:this.state.disabled,helpText:"Needs to be unlocked on your node.",onChange:this.handleAccount.bind(this),name:"account",fieldLabel:"Ethereum Address",placeholder:"0x...",value:this.state.account}))),u.default.createElement(d.default,{disabled:this.state.disabled,onChange:this.handleIpfsAddress.bind(this),name:"ipfsAddress",fieldLabel:"IPFS Host API",placeholder:"http://localhost:5001/",value:this.state.ipfsAddress})),u.default.createElement("div",{className:"modal-footer"},u.default.createElement("button",{type:"button",className:"btn btn-secondary","data-dismiss":"modal"},"Close")))}}]),a}(o.Component);e.exports=m}).call(this,a(0))},287:function(e,t,a){"use strict";var n=u(a(54)),s=u(a(55)),r=u(a(67)),i=u(a(56)),l=u(a(57)),c=a(47),o=u(c);function u(e){return e&&e.__esModule?e:{default:e}}var d=function(e){function t(e){(0,s.default)(this,t);var a=(0,i.default)(this,(t.__proto__||(0,n.default)(t)).call(this,e));return a.state={text:""},a.handleChange=a.handleChange.bind(a),a}return(0,l.default)(t,e),(0,r.default)(t,[{key:"handleChange",value:function(e){var t=e.target.value;this.props.onChange(t)}},{key:"render",value:function(){return o.default.createElement("div",{className:"form-group"},this.props.fieldLabel&&o.default.createElement("label",{htmlFor:this.props.name},this.props.fieldLabel),o.default.createElement("input",{className:"form-control",type:"text",name:this.props.name,id:this.props.name,onChange:this.handleChange,value:this.props.value,placeholder:this.props.placeholder,disabled:this.props.disabled}),this.props.maxValue&&o.default.createElement("small",{className:"form-text text-muted"},"max. ",o.default.createElement("i",{className:"fab fa-ethereum"})," ",this.props.maxValue),this.props.helpText&&o.default.createElement("small",{className:"form-text text-muted"},this.props.helpText),this.props.help3Words&&o.default.createElement("small",{className:"form-text text-muted"},o.default.createElement("a",{href:"https://map.what3words.com/",target:"_blank"},this.props.help3Words)))}}]),t}(c.Component);e.exports=d},418:function(e,t){},573:function(e,t){},575:function(e,t){},614:function(e,t){},615:function(e,t){},631:function(e,t){},68:function(e,t,a){"use strict";var n=m(a(92)),s=m(a(215)),r=m(a(299)),i=m(a(300)),l=m(a(216)),c=a(288),o=a(498),u=m(a(96)),d=m(a(556)),f=m(a(957)),h=m(a(1014));function m(e){return e&&e.__esModule?e:{default:e}}var p={web3Provider:null,web3:null,contracts:{},account:{account:null,balance:0,unclaimed:0},timerStream:null,networkStatusStream:null,accountUpdateStream:null,updateStream:null,gasPrice:10,_contractAddress:!1,connectionData:{ipfsAddress:"https://ipfs.infura.io:5001/",nodeAddress:"http://localhost:8545/",account:""},init:function(){return new l.default(function(e,t){p.reconnect(),p.initStreams(),p.accountUpdateStream.subscribe(function(e){p.account=e}),p.readyContracts().then(function(t){return e()})})},getWeb3:function(e){return p.web3},reconnect:function(){var e=(0,i.default)(r.default.mark(function e(t){var a;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(a=new URL(p.connectionData.ipfsAddress),p.ipfs=(0,d.default)(a.hostname||"localhost",a.port||"5001",{protocol:a.protocol.replace(":","")||"http"}),"undefined"==typeof web3){e.next=7;break}return p.web3Provider=web3.currentProvider,p.web3=web3,p.initGasPrice(),e.abrupt("return");case 7:return p.web3&&p.web3.reset(),p.web3Provider=new f.default.providers.HttpProvider(p.connectionData.nodeAddress),p.web3=new f.default(p.web3Provider),p.connectionData.account&&(p.web3.eth.defaultAccount=p.connectionData.account,p.account.account=p.connectionData.account),p.initGasPrice(),p.contracts=[],e.next=15,p.initContracts();case 15:case"end":return e.stop()}},e,void 0)}));return function(t){return e.apply(this,arguments)}}(),initGasPrice:function(){p.web3.eth.getGasPrice(function(e,t){p.gasPrice=t.toNumber()})},initStreams:function(){p.timerStream=(0,c.timer)(100,1e3),p.initNetworkStatusStream(),p.initAccountUpdateStream()},readyContracts:function(){return new l.default(function(e,t){void 0===p.contracts.TransportMarket?p.initContracts().then(function(t){p.initUpdateStream(),e()}):e()})},initAccountUpdateStream:function(){p.accountUpdateStream=p.timerStream.pipe((0,o.map)(function(e){return Math.round(e/5)})).pipe((0,o.distinctUntilChanged)()).pipe((0,o.mergeMap)(function(e){return c.Observable.create(function(e){if(p.web3Provider){var t=p.getWeb3().eth.defaultAccount;void 0!==t?p.getWeb3().eth.getBalance(t,function(){var a=(0,i.default)(r.default.mark(function a(n,s){var i;return r.default.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return e.next({account:t,balance:s.toNumber(),unclaimed:p.account.unclaimed}),a.next=3,p.initContracts();case 3:return a.next=5,p.getBalance(t);case 5:i=a.sent,e.next({account:t,balance:s.toNumber(),unclaimed:i});case 7:case"end":return a.stop()}},a,void 0)}));return function(e,t){return a.apply(this,arguments)}}()):e.next({account:0,balance:0,unclaimed:0})}})}))},initUpdateStream:function(){p.contracts.TransportMarket.deployed().then(function(e){var t=e.allEvents();p.updateStream=c.Observable.create(function(e){t.watch(function(t,a){return e.next(a)})})})},initNetworkStatusStream:function(){p.networkStatusStream=p.timerStream.pipe((0,o.mergeMap)(function(e){return c.Observable.create(function(){var e=(0,i.default)(r.default.mark(function e(t){return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(p.web3Provider){e.next=3;break}return t.next(!1),e.abrupt("return");case 3:t.next({network:p.getWeb3().version.network,isMetaMask:!!p.getWeb3().currentProvider.isMetaMask,account:p.account.account});case 4:case"end":return e.stop()}},e,void 0)}));return function(t){return e.apply(this,arguments)}}())})).pipe((0,o.distinctUntilChanged)(function(e,t){return(0,s.default)(e)==(0,s.default)(t)})).pipe((0,o.mergeMap)(function(e){return c.Observable.create(function(t){var a="Private";switch(e.network){case"1":a="Mainnet";break;case"2":a="Morden";break;case"3":a="Ropsten";break;case"4":a="Rinkeby";break;case"42":a="Kovan";break;case"loading":a=!1}t.next((0,n.default)({},e,{name:a}))})}))},initContracts:function(){return new l.default(function(){var e=(0,i.default)(r.default.mark(function e(t,n){var s;return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0===p.contracts.TransportMarket){e.next=3;break}return t(),e.abrupt("return");case 3:return e.next=5,a.e(2).then(a.t.bind(null,1142,3));case 5:s=e.sent,p.contracts.TransportMarket=(0,h.default)(s),p.contracts.TransportMarket.setProvider(p.web3Provider),t();case 9:case"end":return e.stop()}},e,void 0)}));return function(t,a){return e.apply(this,arguments)}}())},createParcel:function(e,t,a){return new l.default(function(n,s){p.contracts.TransportMarket.deployed().then(function(r){try{r.createParcel(e,t,{from:p.account.account,gas:4e5,gasPrice:p.gasPrice,value:a}).then(function(e,t){n(t)}).catch(function(e){return s()})}catch(e){s(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")})})},takeParcel:function(e){return new l.default(function(){var t=(0,i.default)(r.default.mark(function t(a,n){var s;return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p.getParcelIndex(e);case 2:s=t.sent,p.contracts.TransportMarket.deployed().then(function(e){try{e.takeParcel(s,{from:p.account.account,gas:2e5,gasPrice:p.gasPrice}).then(function(e){return a()})}catch(e){n(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")});case 4:case"end":return t.stop()}},t,void 0)}));return function(e,a){return t.apply(this,arguments)}}())},pickUpParcel:function(e){return new l.default(function(){var t=(0,i.default)(r.default.mark(function t(a,n){var s;return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p.getParcelIndex(e);case 2:s=t.sent,p.contracts.TransportMarket.deployed().then(function(e){try{e.pickUpParcel(s,{from:p.account.account,gasPrice:p.gasPrice,gas:45e3}).then(function(e){return a()})}catch(e){n(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")});case 4:case"end":return t.stop()}},t,void 0)}));return function(e,a){return t.apply(this,arguments)}}())},cancelParcel:function(e){return new l.default(function(){var t=(0,i.default)(r.default.mark(function t(a,n){var s;return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p.getParcelIndex(e);case 2:s=t.sent,p.contracts.TransportMarket.deployed().then(function(e){try{e.cancelParcel(s,{from:p.account.account,gasPrice:p.gasPrice,gas:15e4}).then(function(e){return a()})}catch(e){n(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")});case 4:case"end":return t.stop()}},t,void 0)}));return function(e,a){return t.apply(this,arguments)}}())},deliverParcel:function(e){return new l.default(function(){var t=(0,i.default)(r.default.mark(function t(a,n){var s,i;return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return s=p.web3.sha3(e),t.next=3,p.getParcelIndex(s);case 3:i=t.sent,p.contracts.TransportMarket.deployed().then(function(t){try{t.deliverParcel(i,e,{from:p.account.account,gasPrice:p.gasPrice,gas:1e5}).then(function(e){return a()}).catch(function(e){return n(e)})}catch(e){n(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")});case 5:case"end":return t.stop()}},t,void 0)}));return function(e,a){return t.apply(this,arguments)}}())},withdraw:function(e){return new l.default(function(){var e=(0,i.default)(r.default.mark(function e(t,a){return r.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:p.contracts.TransportMarket.deployed().then(function(e){try{e.withdraw({from:p.account.account,gasPrice:p.gasPrice,gas:5e4}).then(function(e){return t()})}catch(e){a(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")});case 1:case"end":return e.stop()}},e,void 0)}));return function(t,a){return e.apply(this,arguments)}}())},getParcelIndex:function(e){return new l.default(function(t,a){p.contracts.TransportMarket.deployed().then(function(n){try{n.getParcelIndex.call(e,{from:p.account.account}).then(function(e){t(e)}).catch(function(e){return a(e)})}catch(e){a(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")})})},getParcel:function(e){return new l.default(function(){var t=(0,i.default)(r.default.mark(function t(a,s){var l;return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,p.getParcelIndex(e);case 2:l=t.sent,p.contracts.TransportMarket.deployed().then(function(){var t=(0,i.default)(r.default.mark(function t(i){var c,o,u,d,f,h,m,b;return r.default.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,i.getParcelDescription.call(l,{from:p.account.account});case 3:return c=t.sent,o=JSON.parse(c),t.next=7,i.getParcel.call(l,{from:p.account.account});case 7:u=t.sent,d=u[0],f=u[1],h=u[2],m=u[3],b=o,p.ipfs.files.get(o.hash).then(function(t){t.forEach(function(e){b=(0,n.default)({},b,JSON.parse(e.content.toString("utf8")))}),a({confirmationHash:e,senderAddress:d,haulerAddress:f,fromAddress:p.safeString(b.fromAddress),from3Words:p.safeString(b.from3Words),toAddress:p.safeString(b.toAddress),to3Words:p.safeString(b.to3Words),weight:parseFloat(b.weight),price:h.toNumber(),state:m.toNumber()})}).catch(function(t){a({confirmationHash:e,senderAddress:d,haulerAddress:f,price:h.toNumber(),state:m.toNumber()})}),t.next=19;break;case 16:t.prev=16,t.t0=t.catch(0),s(t.t0);case 19:case"end":return t.stop()}},t,void 0,[[0,16]])}));return function(e){return t.apply(this,arguments)}}()).catch(function(e){u.default.alert("Contract does not exist on this network.")});case 4:case"end":return t.stop()}},t,void 0)}));return function(e,a){return t.apply(this,arguments)}}())},getMyParcels:function(){return p.getParcels("mine")},getTakenParcels:function(){return p.getParcels("taken")},getParcels:function(e){return new l.default(function(t,a){p.contracts.TransportMarket.deployed().then(function(n){try{var s=void 0;switch(e){case"taken":s=n.getTakenParcels;break;case"mine":s=n.getMyParcels;break;default:s=n.getCreatedParcels}s.call({from:p.account.account}).then(function(e){for(var a=[],n=0;n<e.length;n++)a.push({confirmationHash:e[n],fromAddress:null,toAddress:null,weight:null,price:null});t(a)}).catch(function(e){return a(e)})}catch(e){a(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")})})},getMaxValue:function(){return new l.default(function(e,t){p.contracts.TransportMarket.deployed().then(function(a){try{a.maxValue.call({from:p.account.account}).then(function(t){e(t.toNumber())}).catch(function(e){return t(e)})}catch(e){t(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")})})},getBalance:function(e){return new l.default(function(t,a){p.contracts.TransportMarket.deployed().then(function(n){try{n.getBalance.call(e,{from:e}).then(function(e){t(e.toNumber())}).catch(function(e){return a(e)})}catch(e){a(e)}}).catch(function(e){u.default.alert("Contract does not exist on this network.")})})},safeString:function(e){var t=document.createElement("div");return t.innerHTML=e,t.innerText}};e.exports=p},7:function(e,t,a){"use strict";var n=h(a(47)),s=a(500),r=h(a(68)),i=h(a(1123)),l=h(a(1127)),c=h(a(1133)),o=h(a(1135)),u=h(a(1136)),d=h(a(1140)),f=h(a(1141));function h(e){return e&&e.__esModule?e:{default:e}}var m={init:function(){m.initWeb3()},initWeb3:function(){r.default.init().then(function(e){return m.initFrontend()})},initFrontend:function(){(0,s.render)(n.default.createElement(i.default,null),document.querySelector("#networkIndicator")),(0,s.render)(n.default.createElement(l.default,null),document.querySelector("#accountData")),(0,s.render)(n.default.createElement(c.default,null),document.querySelector("#receivedParcelForm")),(0,s.render)(n.default.createElement(o.default,null),document.querySelector("#createParcelForm")),(0,s.render)(n.default.createElement(u.default,null),document.querySelector("#parcelList")),(0,s.render)(n.default.createElement(d.default,null),document.querySelector("#messageContainer")),(0,s.render)(n.default.createElement(f.default,null),document.querySelector("#configuration"))}};e.exports=m},843:function(e,t){},855:function(e,t){},96:function(e,t,a){"use strict";var n=c(a(54)),s=c(a(55)),r=c(a(56)),i=c(a(57)),l=a(288);function c(e){return e&&e.__esModule?e:{default:e}}var o=function(e){function t(){return(0,s.default)(this,t),(0,r.default)(this,(t.__proto__||(0,n.default)(t)).apply(this,arguments))}return(0,i.default)(t,e),t}(c(a(134)).default),u={_eventEmitter:null,_messageStream:null,init:function(e){null===u._eventEmitter&&(u._eventEmitter=new o,u._messageStream=(0,l.fromEvent)(u._eventEmitter,"message"))},getMessageStream:function(e){return u.init(),u._messageStream},alert:function(e){u._eventEmitter.emit("message",{message:e,alert:!0,visible:!0})},notice:function(e){u._eventEmitter.emit("message",{message:e,alert:!1,visible:!0})}};e.exports=u}}]);