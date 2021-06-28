
/*
https://worldwideinterweb.com/dumbest-kickstarters-of-all-time/

https://www.kickstarter.com/projects/diyhack/barfsuit-clothes-for-extreme-situations
https://www.kickstarter.com/projects/poptheatr/poptheatr-the-personal-theater-for-watching-comfor

https://www.kickstarter.com/projects/1788055043/my-hitch-travel-hands-free

https://www.kickstarter.com/projects/1349090630/footsies-pedaling-romance-below-the-knees/?ref=kicktraq

https://www.kickstarter.com/projects/1300617908/little-eatz-share-a-snack-with-your-best-friend/?ref=kicktraq

    //https://www.kickstarter.com/projects/zackdangerbrown/potato-salad
    
https://www.kickstarter.com/projects/1316011250/kisa
        
      https://www.indiegogo.com/projects/alpha-pillow-2-aqua-cooling-membrane#/
        
        Todo: correct choices
        nice todo: howler sfx, close button for disclaimer, refresh page at the end, 
        
        Kickstarter Success or Fail
        
        Disclaimer: All info was compiled from Kickstarter and the original project pledge page. I did not pledge to any of the projects or know any of the creators.
        
        --- Credits ---
        -This web game:
        Jesse Drain
        
        -Card graphic (edited):
        Avery Ross - https://opengameart.org/content/trading-card-template
        
        -Tinder Carousel code base:
        LikeCarousel (c) 2019 Simone P.M. github.com/simonepm - Licensed MIT
        https://github.com/simonepm/likecarousel
        https://medium.com/@simonepm/build-a-full-featured-tinder-like-carousel-in-vanilla-javascript-part-i-44ca3a906450
        
        -Kickstarter project images belong to the project creators
        */

        class Carousel {

            constructor(element) {
                this.dynamicText = {
                  end_text: "You got ?/10 correct choices. Nice try!<br><br>*Click anywhere to restart*"
                }
                this.resources = {
                  
                  cardfront_img: "url(images/ks-card1.png)",
                  cardback_img: "url(images/cardback.png)",
                  card1_img: "url(images/card-images-518-321/ks-card-myhitch2.png)",
                  card2_img: "url(images/card-images-518-321/ks-card-0002.png)",
                  card3_img: "url(images/card-images-518-321/ks-card-0001.png)",
                  card4_img: "url(images/card-images-518-321/ks-card-0003.png)",
                  card5_img: "url(images/card-images-518-321/ks-card-0004.png)",
                  card6_img: "url(images/card-images-518-321/ks-card-0005.png)",
                  card7_img: "url(images/card-images-518-321/ks-card-0008.png)",
                  card8_img: "url(images/card-images-518-321/ks-card-0006.png)",
                  card9_img: "url(images/card-images-518-321/ks-card-0007.png)",
                  card10_img: "url(images/card-images-518-321/Sprite-00010.png)"
                }
                this.playerchoices = "";
                this.currentlevel = 1;
                
                this.board = element
                this.fail = document.getElementById("fail")
                this.success = document.getElementById("success")
              
                var cardfronts = document.getElementsByClassName("card-front")
              for(var i = 0; i < cardfronts.length; i++) {
                cardfronts[i].style.backgroundImage = this.resources.cardfront_img;
              }
                 var cardbacks = document.getElementsByClassName("card-back")
              for(var i = 0; i < cardbacks.length; i++) {
                cardbacks[i].style.backgroundImage = this.resources.cardback_img;
              }
              document.getElementById("card1_img").style.backgroundImage = this.resources.card1_img;
              document.getElementById("card2_img").style.backgroundImage = this.resources.card2_img;
              document.getElementById("card3_img").style.backgroundImage = this.resources.card3_img;
              document.getElementById("card4_img").style.backgroundImage = this.resources.card4_img;
              document.getElementById("card5_img").style.backgroundImage = this.resources.card5_img;
              document.getElementById("card6_img").style.backgroundImage = this.resources.card6_img;
              document.getElementById("card7_img").style.backgroundImage = this.resources.card7_img;
              document.getElementById("card8_img").style.backgroundImage = this.resources.card8_img;
              document.getElementById("card9_img").style.backgroundImage = this.resources.card9_img;
              document.getElementById("card10_img").style.backgroundImage = this.resources.card10_img;
              
                this.hammer = new Hammer(document)
                this.hammer.on('tap', (e)=> {
                  document.body.removeChild(document.getElementById("box_intro"));
                  this.hammer.off('tap')
                  // handle gestures
                  this.handle()
                })

                

            }

            handle() {

                // list all cards
                this.cards = this.board.querySelectorAll('.card')

                // get top card
                this.topCard = this.cards[this.cards.length - 1]

                // get next card
                this.nextCard = this.cards[this.cards.length - 2]

                // if at least one card is present
                if (this.cards.length > 0) {

                    // set default top card position and scale
                    this.topCard.style.transform =
                        'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'

                    // destroy previous Hammer instance, if present
                    if (this.hammer) this.hammer.destroy()

                    // listen for tap and pan gestures on top card
                    this.hammer = new Hammer(this.topCard)
                    this.hammer.add(new Hammer.Pan({
                        position: Hammer.position_ALL,
                        threshold: 0
                    }))

                    // pass events data to custom callbacks
                    this.hammer.on('pan', (e) => {
                        this.onPan(e)
                    })

                }
            }

            onPan(e) {
                
                if (!this.isPanning) {

                    this.isPanning = true

                    // remove transition properties
                    this.topCard.style.transition = null
                    if (this.nextCard) this.nextCard.style.transition = null

                    // get top card coordinates in pixels
                    let style = window.getComputedStyle(this.topCard)
                    let mx = style.transform.match(/^matrix\((.+)\)$/)
                    this.startPosX = mx ? parseFloat(mx[1].split(', ')[4]) : 0
                    this.startPosY = mx ? parseFloat(mx[1].split(', ')[5]) : 0

                    // get top card bounds
                    let bounds = this.topCard.getBoundingClientRect()

                    // get finger position on top card, top (1) or bottom (-1)
                    this.isDraggingFrom =
                        (e.center.y - bounds.top) > this.topCard.clientHeight / 2 ? -1 : 1

                }

                // get new coordinates
                let posX = e.deltaX + this.startPosX
                let posY = e.deltaY + this.startPosY

                // get ratio between swiped pixels and the axes
                let propX = e.deltaX / this.board.clientWidth
                let propY = e.deltaY / this.board.clientHeight
                
                let instruction_opacity = propX;
                
                // get swipe direction, left (-1) or right (1)
                let dirX = e.deltaX < 0 ? -1 : 1

                // get degrees of rotation, between 0 and +/- 45
                let deg = dirX * Math.abs(propX) * 45 //* this.isDraggingFrom
                
                // get scale ratio, between .95 and 1
                let scale = (95 + (5 * Math.abs(propX))) / 100
                
                if(instruction_opacity < 0) {
                  this.fail.style.opacity = -instruction_opacity * 2.2;
                } else {
                  
                this.success.style.opacity = instruction_opacity * 2.2;
                }
                
                
                // move and rotate top card
                this.topCard.style.transform =
                    'translateX(' + posX + 'px) translateY(' + posY + 'px) rotate(' + deg + 'deg) rotateY(0deg) scale(1)'

                // scale up next card
                if (this.nextCard) this.nextCard.style.transform =
                    'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(' + scale + ')'

                if (e.isFinal) {

                    this.isPanning = false
                  
                    let successful = false

                    // set back transition properties
                    this.topCard.style.transition = 'transform 200ms ease-out'
                    if (this.nextCard) this.nextCard.style.transition = 'transform 100ms linear'
                    
                  this.fail.style.opacity = 0;
                  this.success.style.opacity = 0;
                  
                    //
                  //  && e.direction == Hammer.DIRECTION_RIGHT
                    if (propX > 0.25) {

                        successful = true
                        // get right border position
                        //posX = this.board.clientWidth;
                        this.Choose(Hammer.DIRECTION_RIGHT);
                    } else if (propX < -0.25) {

                        successful = true
                        // get left border position
                        this.Choose(Hammer.DIRECTION_LEFT);
                    }

                    if (successful) {

                        this.hammer.off('pan', (e) => {
                            this.onPan(e)
                        })
                       
                        this.topCard.style.transform = 'translateX(-50%) translateY(-50%) rotate(0deg) scale(1)'
                        this.topCard.childNodes[1].style.transform = "rotateY(180deg)"; // card inner
                        setTimeout(() => {
                          this.hammer.on('tap', (e)=> {
                            // newcard()
                            this.board.removeChild(this.topCard)
                            this.currentlevel+=1;
                            this.handle()
                            
                            if(this.currentlevel == 11) {
                              document.getElementById("box_final").style.display = 'block';
                            }
                            
                            this.hammer.off('tap')
                          })
                        }, 4000)
                        // wait transition end
                        //setTimeout(() => {
                          
                  
                            // remove swiped card
                            //this.board.removeChild(this.topCard)
                            // add new card
                            //this.push()
                            // handle gestures on new top card
                            //this.handle()
                        //}, 200)

                    } else {
                        
                      
                        // reset cards position and size
                        this.topCard.style.transform =
                            'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)'
                        if (this.nextCard) this.nextCard.style.transform =
                            'translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(0.95)'

                    }

                }

            }
            Choose(dir) {
              if(dir == Hammer.DIRECTION_LEFT) {
                this.playerChoices += "l"
              } else {
                this.playerChoices += "r"
              }
              
              this.topCard.style.transform =
                    'transform: translateX(-50%) translateY(-50%) rotate(0deg) rotateY(180deg) scale(1);'
              this.topCard.childNodes[1].style.transform = "transform: rotateY(180deg);"; // card inner
              setTimeout(() => {
                          this.animateNum('text-actualNum' + this.currentlevel, 0, parseInt(document.getElementById("text-actualNum" + this.currentlevel).attributes.actual.nodeValue), 300);
                  // play powerup sfx
                        }, 1000)
              
            }
          animateNum(id, start, end, duration) {
              if (start === end) return;
              var range = end - start;
              var current = start;
              var increment = Math.floor(end/300) + 1;
              var stepTime = Math.abs(Math.floor(duration / range));
              var obj = document.getElementById(id);
              var timer = setInterval(function() {
                current += increment;
                var currectAfterFormatting = current.toString().split(",");
                currectAfterFormatting[0]=currectAfterFormatting[0].replace(/\B(?=(\d{3})+(?!\d))/g,",");
                obj.innerHTML = "$" + currectAfterFormatting.join(",");
                
                if (current >= end) {
                  clearInterval(timer);
                }
              }, stepTime);
            }
            push() {

                let card = document.createElement('div')
                let text_title = document.createElement('div')
                let text_pagenum = document.createElement('div')
                let img_projectimage = document.createElement('div')
                let text_goal = document.createElement('div')
                let text_description = document.createElement('div')

                card.classList.add('card')
                img_projectimage.classList.add('projectImage')
              
                card.appendChild(text_title);
                card.appendChild(text_pagenum);
                card.appendChild(img_projectimage);
                card.appendChild(text_goal);
                card.appendChild(text_description);
      
                img_projectimage.style.backgroundImage =
                    "url('https://picsum.photos/320/320/?random=" + Math.round(Math.random() * 1000000) + "')"

                this.board.insertBefore(card, this.board.firstChild)

            }

        }

        let board = document.querySelector('#board')

        let carousel = new Carousel(board)
