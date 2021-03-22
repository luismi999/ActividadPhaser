     var configuracion = {
        type: Phaser.AUTO,
        width: 800,
        height: 1000,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: {y:300},
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        }
    };

    var game = new Phaser.Game(configuracion);

    function preload () {

        this.load.image('space','/assets/space.png');
        this.load.image('plataforma','/assets/plataforma.png');
        this.load.spritesheet('astro', 'assets/astro.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/slime.png');
        //CARGO MI MUSICA
        this.load.audio('musica','kronos.mp3');
        this.load.audio('moneda','moneda.mp3');
    }
    //AQUI CREO MIS VARIABLES
    var plataformas;
    var personaje;
    var cursors;
    var bombs;
    var stars;
    var score = 0;
    var gameOver = false;
    var scoreText;
    var music;
    var coin;

    function create () {
        //INSERTO MI MUDICA
        music = this.sound.add('musica');
        coin = this.sound.add('moneda');
        music.play();
        //AQUI CREO MI FONDO
        this.add.image(400,500,'space');
        //AQUI CREO MI GRUPO DE PLATAFORMAS ESTATICAS
        plataformas = this.physics.add.staticGroup();
        //AQUI AGREGO TODAS MIS PLATAFORMAS
        plataformas.create(400,968, 'plataforma').setScale(2).refreshBody();
        plataformas.create(200,750,'plataforma').setScale(0.5).refreshBody();
        plataformas.create(600,750,'plataforma').setScale(0.5).refreshBody();
        plataformas.create(400,600,'plataforma').setScale(0.8).refreshBody();
        plataformas.create(200,450,'plataforma').setScale(0.5).refreshBody();
        plataformas.create(600,450,'plataforma').setScale(0.5).refreshBody();
        plataformas.create(400,300,'plataforma').setScale(0.8).refreshBody();
        
        plataformas.create(50,600,'plataforma').setScale(0.5).refreshBody();
        plataformas.create(750,600,'plataforma').setScale(0.5).refreshBody();
        plataformas.create(400,900,'plataforma').setScale(0.5).refreshBody();

        //AQUI CREO MI Y AGREGO A MI PERSONAJE
        personaje = this.physics.add.sprite(100, 450, 'astro');

        personaje.setBounce(0.2);
        personaje.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('astro', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'astro', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('astro', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        //AQUI PONEMOS LAS COLICIONES ENTRE JUGADOR Y PLATAFORMAS
        cursors = this.input.keyboard.createCursorKeys();
        //ESTRELLAS
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
        //AQUI DECLARO MIS BOMBAS
        bombs = this.physics.add.group();
        //AQUI CONFIGURAMOS NUESTRO MARCADOR
        scoreText = this.add.text(250, 16, 'Puntuación: 0', { fontSize: '40px', fill: 'white' });
        //ESTAS SON LAS COLICIONES DE TODOS LOS OBJETOS
        this.physics.add.collider(stars, plataformas);
        this.physics.add.collider(personaje, plataformas);
        this.physics.add.collider(bombs, plataformas);
        //COLECTORES
        this.physics.add.overlap(personaje, stars, collectStar, null, this);
        this.physics.add.collider(personaje, bombs, hitBomb, null, this);
    }

    function update () {
        //ESTADO DEL JUEGO
        if (gameOver)
        {
            return;
        }
        //AQUI COLOCAMOES LOS KMOVIMIENTOS DE MI PERSONAJE
        if (cursors.left.isDown)
        {
            personaje.setVelocityX(-100);

            personaje.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            personaje.setVelocityX(100);

            personaje.anims.play('right', true);
        }
        else
        {
            personaje.setVelocityX(0);

            personaje.anims.play('turn');
        }

        if (cursors.up.isDown && personaje.body.touching.down)
        {
            personaje.setVelocityY(-330);
        }
        
    }
    //FUNCION DE RECOLECCION DE ESTRELLAS
    function collectStar (personaje,star)
        {
            star.disableBody(true, true);
            score += 10;
            coin.play();
            coin.volume = 0.2;
            scoreText.setText('Score: ' + score);

            //NUESTRAS BOMBAS
            if (stars.countActive(true) === 0)
            {
                stars.children.iterate(function (child) {

                    child.enableBody(true, child.x, 0, true, true);

                });

                var x = (personaje.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

            }
        }
    //FUNCOION DE MI BOMBAS
    function hitBomb (personaje, bomb)
    {
        this.physics.pause();

        personaje.setTint(0xff0000);

        personaje.anims.play('turn');

        gameOver = true;
    }