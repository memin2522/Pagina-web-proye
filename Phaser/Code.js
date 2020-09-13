window.onload = function() {

    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    var p = 0;
    var sprite;
    var livingEnemies = [];
    var vida = 3;
    var score = 0;
    var scoreString = '';
    var scoreText;
    var time = 0;
    var prob = 0;
    var firingTimer = 0;
    var bulletTime = 0;
    var powerCharge = 0;
    var recharge = 0;
    var stateText;

    function preload () {

        game.load.image('ms', 'sprites/Sprite_player.png');
        game.load.spritesheet('kaboom', 'sprites/explosion.png',64,64,25);
        game.load.spritesheet('boom', 'sprites/boom.png',64,64,16);
        game.load.image('starfield', 'sprites/starfield.png');
        game.load.image('bullet', 'sprites/bullet.png');
        game.load.image('enemyBullet', 'sprites/enemy-bullet.png');
        game.load.image('one', 'sprites/Sprite_one.png');
        game.load.image('three', 'sprites/Sprite_three.png');
        game.load.image('two', 'sprites/Sprite_two.png');
        game.load.image('heart', 'sprites/heart.png');
        game.load.image('power', 'sprites/Power.png');
        game.load.image('recharge', 'sprites/Recharge.png');
        game.load.audio('laserPlayer','musica/laser.mp3')
        game.load.audio('expo','musica/BoomEnemy.mp3')
        game.load.audio('superBoom','musica/BoomPlayer.mp3')
        game.load.audio('cool','musica/cooldown.mp3')
        game.load.audio('musica','musica/musica.mp3')
        game.load.audio('gameover','musica/gameover.mp3')


    }

    function create () {
      // inside create() function
      game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;
      //game.scale.setScreenSize(true);

    game.physics.startSystem(Phaser.Physics.ARCADE);


    //Scroll campo de estrellas
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    //Sprites
    player = game.add.sprite(350, 500, 'ms');

    //Musica
    musica = game.add.audio('musica');
    musica.play();
    musica.volume = 0.1;


    //Grupo de balas
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    // Balas enemigo
    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    enemyBullets.createMultiple(1000, 'enemyBullet');
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 1);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);



    //  An explosion pool
    explosions = game.add.group();
    explosions.createMultiple(100, 'kaboom');
    explosions.forEach(setupEnemyOne, this);

    explosionsPower = game.add.group();
    explosionsPower.createMultiple(100, 'kaboom');
    explosionsPower.forEach(setupEnemyOne, this);

    explosionsPower1 = game.add.group();
    explosionsPower1.createMultiple(100, 'kaboom');
    explosionsPower1.forEach(setupEnemyOne, this);

    explosionsPower2 = game.add.group();
    explosionsPower2.createMultiple(100, 'kaboom');
    explosionsPower2.forEach(setupEnemyOne, this);



    //  An explosion pool
    supExplosions = game.add.group();
    supExplosions.createMultiple(30, 'boom');
    supExplosions.forEach(setupPlayer, this);

    //Enemigo uno

    enemyOne = game.add.group();
    enemyOne.enableBody = true;
    enemyOne.createMultiple(50, 'one');
    enemyOne.setAll('anchor.x', 1);
    enemyOne.setAll('anchor.y', 1);
    enemyOne.setAll('outOfBoundsKill', true);
    enemyOne.setAll('checkWorldBounds', true);

    //Enemigo dos

    enemyTwo = game.add.group();
    enemyTwo.enableBody = true;
    enemyTwo.createMultiple(50, 'two');
    enemyTwo.setAll('anchor.x', 1);
    enemyTwo.setAll('anchor.y', 1);
    enemyTwo.setAll('outOfBoundsKill', true);
    enemyTwo.setAll('checkWorldBounds', true);

    //Enemigo tres

    enemyThree = game.add.group();
    enemyThree.enableBody = true;
    enemyThree.createMultiple(50, 'three');
    enemyThree.setAll('anchor.x', 1);
    enemyThree.setAll('anchor.y', 1);
    enemyThree.setAll('outOfBoundsKill', true);
    enemyThree.setAll('checkWorldBounds', true);

    //  Lives
    lives = game.add.group();
    lives.createMultiple(3, 'lives')
    vida1 = game.add.sprite(290,530,'heart')
    vida2 = game.add.sprite(350,530,'heart')
    vida3 = game.add.sprite(410,530,'heart')

    //Barras
    powerBar = game.add.sprite(304,50,'power');
    chargeBar = game.add.sprite(304,30,'recharge');
    powerBar.scale.x = 0;
    chargeBar.scale.x = 0;

    //Fisicas
    game.physics.enable( [ player ], Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;

    //Controles

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    powerButton= game.input.keyboard.addKey(Phaser.Keyboard.P);

    //  The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    //Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    }
    function boomOne(){

        enemyOne.forEachAlive(function(one){

        // put every living enemy in an array
        livingEnemies.push(one);
        });
        if(livingEnemies.length>0){
            for(var i = 0; i<livingEnemies.length-1;i++){
        var shooter=livingEnemies[i];
        var explosion = explosionsPower.getFirstExists(false);
        explosion.reset(shooter.body.x, shooter.body.y);
        explosion.play('kaboom', 50, false, true);
        shooter.kill()}
    }
}
    function boomTwo(){

        enemyTwo.forEachAlive(function(two){

        // put every living enemy in an array
        livingEnemies.push(two);
        });
        if(livingEnemies.length>0){
            for(var i = 0; i<livingEnemies.length;i++){
        var shooter=livingEnemies[i];
        var explosion = explosionsPower1.getFirstExists(false);
        explosion.reset(shooter.body.x, shooter.body.y);
        explosion.play('kaboom', 50, false, true);
        shooter.kill()}
    }
}
    function boomThree(){

        enemyThree.forEachAlive(function(three){

        // put every living enemy in an array
        livingEnemies.push(three);
        });
        if(livingEnemies.length>0){
            for(var i = 0; i<livingEnemies.length-1;i++){
        var shooter=livingEnemies[i];
        var explosion = explosionsPower2.getFirstExists(false);
        explosion.reset(shooter.body.x, shooter.body.y);
        explosion.play('kaboom', 50, false, true);
        shooter.kill()}
    }
    }



    function collisionHandler (bullet, one) {

    //  When a bullet hits an alien we kill them both
    bullet.kill();
    one.kill();

     //  And create an explosion :)
    score += 1;
    scoreText.text = scoreString + score;
    var explosion = explosions.getFirstExists(false);
    explosion.reset(one.body.x, one.body.y);
    explosion.play('kaboom', 50, false, true);
    explo=game.add.audio('expo');
    explo.play();
    explo.volume = 0.1;



}


function enemyFiresTwo () {


     enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

     enemyTwo.forEachAlive(function(two){

    // put every living enemy in an array
    livingEnemies.push(two);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
    prob = prob + (time/10000)
    var random=game.rnd.integerInRange(0,livingEnemies.length-1);

    // randomly select one of them
    var shooter=livingEnemies[random];
    // And fire the bullet from this enemy
    var r = Math.random();
    if(r>0 && r<0.25){
    enemyBullet.reset(shooter.body.x + 32, shooter.body.y);
    enemyBullet.body.velocity.y = 100 ;
    firingTimer = game.time.now + 100;}

    else if(r>0.25 && r<0.5){
    enemyBullet.reset(shooter.body.x + 32, shooter.body.y + 64);
    enemyBullet.body.velocity.y = -100 ;
    firingTimer = game.time.now + 100;}

    else if(r>0.5 && r<0.75){
    enemyBullet.reset(shooter.body.x , shooter.body.y + 32);
    enemyBullet.body.velocity.x = -100 ;
    firingTimer = game.time.now + 100;}

    else if(r>0.75 && r<1){
    enemyBullet.reset(shooter.body.x+64 , shooter.body.y + 32);
    enemyBullet.body.velocity.x = 100 ;
    firingTimer = game.time.now + 100;}


}


}

function enemyFiresThree () {


     enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

     enemyThree.forEachAlive(function(three){

    // put every living enemy in an array
    livingEnemies.push(three);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {
    prob = prob + (time/10000)
    var random=game.rnd.integerInRange(0,livingEnemies.length-1);

    // randomly select one of them
    var shooter=livingEnemies[random];
    // And fire the bullet from this enemy
    var r = Math.random();
    if(r>0 && r<0.33){
    enemyBullet.reset(shooter.body.x + 20, shooter.body.y+40);
    enemyBullet.body.velocity.y = 100 ;
    enemyBullet.body.velocity.x = -50 ;
    firingTimer = game.time.now + 100;}

    else if(r>0.33 && r<0.66){
    enemyBullet.reset(shooter.body.x + 5, shooter.body.y + 40);
    enemyBullet.body.velocity.y = 100 ;
    enemyBullet.body.velocity.x = -50 ;
    firingTimer = game.time.now + 100;}

    else if(r>0.66 && r<1){
    enemyBullet.reset(shooter.body.x + 35 , shooter.body.y + 40);
    enemyBullet.body.velocity.y = 100 ;
    enemyBullet.body.velocity.x = -50 ;
    firingTimer = game.time.now + 100;}




}


}

 function enemyHitsPlayer (player,bullet) {

    bullet.kill();

    vida = vida -1

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (vida < 3)
    {
    vida1.kill();
    expo = game.add.audio('expo');
    expo.play();
    expo.volume = 0.1;
    //enemyBullets.callAll('kill');

    }
    if (vida < 2)
    {

    vida2.kill();
    expo = game.add.audio('expo');
    expo.play();
    expo.volume = 0.1;
    //enemyBullets.callAll('kill');

    }
    if (vida < 1)
    {
    player.kill();
    vida3.kill();
    enemyBullets.callAll('kill');

    gameover = game.add.audio('gameover');
    gameover.play();
    gameover.volume = 0.5;



    stateText.text=" GAME OVER \n Click to restart";
    stateText.visible = true;

    //the "click to restart" handler
    game.input.onTap.addOnce(restart,this);

    }

}






    function update() {
    starfield.tilePosition.y += 2;
    time += 1;

    createAliens();


        if (player.alive)
{
    //  Resetea el jugador y mira su posicion
    player.body.velocity.setTo(0, 0);

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 200;
    }
    else if (cursors.up.isDown)
    {
        player.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        player.body.velocity.y = 200;
    }

    //  Disparo
    if (fireButton.isDown)
    {
        recharge += 0.005
        if(recharge < 1){
        fireBullet();
        chargeBar.scale.x = recharge
        }
        else if (recharge > 1){
        chargeBar.scale.x = 1
        recharge = 1


        }

    }
    if(powerButton.isDown){
        firePower();
        enemyFires();
        enemyFiresTwo();
        enemyFiresThree();
    }
    if (game.time.now > firingTimer)
    {
        enemyFires();
        enemyFiresTwo();
        enemyFiresThree();
    }
    if(recharge > 0){
        chargeBar.scale.x = recharge
        recharge -=0.001;
    }

    //  Run collision
    game.physics.arcade.overlap(bullets, enemyOne, collisionHandler, null, this);
    game.physics.arcade.overlap(bullets, enemyTwo, collisionHandler, null, this);
    game.physics.arcade.overlap(bullets, enemyThree, collisionHandler, null, this);

    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

    powerCharge += 0.0009;
    if(powerCharge < 1){

        powerBar.scale.x = powerCharge
        }
        else if (powerCharge > 1){
        powerBar.scale.x = 1
        powerCharge = 1
        cool=game.add.audio('cool');
      cool.play();
      cool.volume = 0.05;


        }
    console.log(recharge)




}



}


    function firePower(){

    if(powerCharge > 0.95){
    boomOne();
    boomTwo();
    boomThree();
    powerCharge = 0;
    enemyBullets.callAll('kill');

    explo=game.add.audio('superBoom');
    explo.play();
    explo.volume = 1;

    }



    }




    function fireBullet () {

    laser=game.add.audio('laserPlayer');
    laser.play();
    laser.volume = 0.1;
    if(game.time.now>bulletTime){
    //  Tomar una bala
    bullet = bullets.getFirstExists(false);
    var r = Math.random();


    if (bullet && r>0 && r<0.5)
    {
        //  Disparar
        bullet.reset(player.x - 13, player.y - 10 );
        bullet.body.velocity.y = -400 ;
        firingTimer = game.time.now + 1000;

    }


    else if (bullet && r>0.5 && r<1)
    {
        //  Disparar
        bullet.reset(player.x + 13, player.y - 10  );
        bullet.body.velocity.y = -400 ;
        bulletTime = game.time.now + 100;

    }

    }

    }

    function setupEnemyOne (enemyOne) {

    enemyOne.anchor.x = 0.5;
    enemyOne.anchor.y = 0.5;
    enemyOne.animations.add('kaboom');

}
    function setupPlayer (enemyOne) {

    player.anchor.x = 0.5;
    player.anchor.y = 0.5;
    player.animations.add('boom');

}

    function createAliens () {
        var rOne = Math.random();
        var rTwo = Math.random();
        var rThree = Math.random();
        var r2 = Math.random()*10;
        //console.log(prob)
        prob = prob + (time/10000)

       if(rOne>0 && rOne<0.08){

            one = enemyOne.getFirstExists(false);
            if(one){
            one.reset(200 * r2, 0 );
            one.body.velocity.y = 50 ;
            p=p+1

        }
    }
        if(rTwo>0 && rTwo<0.01){


            two = enemyTwo.getFirstExists(false);
            if(two){
            two.reset(200 * r2, 0 );
            two.body.velocity.y = 50;
            if(two.position.x<400){
            two.body.velocity.y = 50;
            two.body.velocity.x = 50;
            }
            else{
            two.body.velocity.y = 50;
            two.body.velocity.x = -50;
            }
            p=p+1

    }
}
        if(rThree>0 && rThree<0.03){

            three = enemyThree.getFirstExists(false);
            if(three){
                if(r2<0.5){
                three.reset(0, 100*r2 );
                three.body.velocity.x = 50;}
                else{
                three.reset(800, 100*r2 );
                three.body.velocity.x = -50;}


    }
        }
    }


    function enemyFires () {


    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

     enemyOne.forEachAlive(function(one){

    // put every living enemy in an array
    livingEnemies.push(one);
    });


    if (enemyBullet && livingEnemies.length > 0)
    {

    var random=game.rnd.integerInRange(0,livingEnemies.length-1);

    // randomly select one of them
    var shooter=livingEnemies[random];
    // And fire the bullet from this enemy
    enemyBullet.reset(shooter.body.x+25, shooter.body.y+50);

    enemyBullet.body.velocity.y = 100;
    firingTimer = game.time.now + 100;

}
}
function restart () {

//  A new level starts

//resets the life count
vida = 3;
vida1.revive()
vida2.revive()
vida3.revive()


//  And brings the aliens back from the dead :)
enemyOne.callAll('kill');
enemyTwo.callAll('kill');
enemyThree.callAll('kill');
powerCharge = 0;
recharge = 0;
chargeBar.scale.x = 0
score = 0
musica.stop();
musica.play();

//revives the player
player.revive();

//hides the text
stateText.visible = false;

}


}
