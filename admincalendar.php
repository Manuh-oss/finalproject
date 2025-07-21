<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" href="calendar.css"/>
    <link rel="stylesheet" href="./fontawesome-free-6.7.2-web/css/all.css" />
    <script defer src="calendar.js"></script>
  </head>
  <body>
    <header class="mobile-tablet">
      <div class="header-tittle">
        <i class="fa fa-school"></i>
        <h2>highschool</h2>
      </div>
      <div class="open">
        <span><i class="fa fa-bars"></i></span>
      </div>
    </header>
    <main>
      <aside class="navigation">
        <nav class="navigation-container">
          <div class="head">
            <strong>
              <span><i class="fa fa-user-graduate"></i></span> highschool</strong>
          </div>
          <div class="body">
            <a href="#"
              ><i class="fa fa-home"></i>
              <span class="writing">Dashboard</span></a
            >
            <a href="#"
              ><i class="fa fa-user-plus"></i>
              <span class="writing">Enrol</span></a
            >
            <a href="#"
              ><i class="fa fa-users"></i>
              <span class="writing">Profiles</span></a
            >
            <a href="#"
              ><i class="fa fa-clipboard"></i>
              <span class="writing">Result</span></a
            >
            <a href="#"
              ><i class="fa fa-calendar"></i>
              <span class="writing">event</span></a
            >
            <a href="#"
              ><i class="fa fa-table"></i>
              <span class="writing">Timetable</span></a
            >
          </div>
        </nav>
      </aside>
      <div class="main-main">
        <div class="tittle">
          <h1><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i> Event</h1>
          <div class="icons-profile">
            <div class="search"><i class="fa fa-search fa-beat open-search"></i>
              <div class="search-dropdown hide">
                <form class="search-input">
                  <input type="text" name="search" id="" class="search" required>
                  <button type="submit" class="submit"><i class="fa fa-search"></i></button>
                </form>

                <div class="recents">
                  <h3>recent search</h3>
                  <ul>
                    <li><span class="text">mAT 121 course</span><span class="icon"><i class="fa-regular fa-trash-alt"></i></span></li>
                    <li><span class="text">mAT 121 course</span><span class="icon"><i class="fa-regular fa-trash-alt"></i></span></li>
                    <li><span class="text">mAT 121 course</span><span class="icon"><i class="fa-regular fa-trash-alt"></i></span></li>
                    <li><span class="text">mAT 121 course</span><span class="icon"><i class="fa-regular fa-trash-alt"></i></span></li>
                    <li><span class="text">mAT 121 course</span><span class="icon"><i class="fa-regular fa-trash-alt"></i></span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="notification">
              <i class="fa-regular fa-bell"></i>
              <div class="notification-dropdown closed">
                <ul>
                 <li class="collapsed">
                    <div class="icon">
                      <i class="fas fa-bell fa-shake"></i>
                    </div>
                    <div class="text">examination results are ready</div>
                    <div class="icon">
                      <i class="fas fa-angle-down caret"></i>
                    </div>
                  </li>
                  <li style="display: none;" class="expanded">
                    <div class="head"><i class="fas fa-bell fa-shake"></i> <strong>educative</strong> <i class="fas fa-angle-up upwards"></i></div>
                    <div class="body">
                      <p>midterm exams results have just been posted!!</p>
                      <button type="button">mark as read</button>
                    </div>
                  </li>

                  <li class="collapsed">
                    <div class="icon">
                      <i class="fas fa-bell fa-shake"></i>
                    </div>
                    <div class="text">examination results are ready</div>
                    <div class="icon">
                      <i class="fas fa-angle-down caret"></i>
                    </div>
                  </li>
                  <li style="display: none;" class="expanded">
                    <div class="head"><i class="fas fa-bell fa-shake"></i> <strong>educative</strong> <i class="fas fa-angle-up upwards"></i></div>
                    <div class="body">
                      <p>midterm exams results have just been posted!!</p>
                      <button type="button">mark as read</button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <i class="fa fa-cog fa-spin"></i>
            <span class="profile-box">
              <img src="./teachers/martin.jpg" alt="">
            </span>
          </div>
        </div>
        <div class="main"> 
          <section class="calendar-container">
            <div class="head">
              <h2>calendar</h2>
              <div class="btns">
                <select name="" id="month">
                  <option value="0">january</option>
                  <option value="1">February</option>
                  <option value="2">march</option>
                  <option value="3">April</option>
                  <option value="4">may</option>
                  <option value="5">june</option>
                  <option value="6">july</option>
                  <option value="7">august</option>
                  <option value="8">september</option>
                  <option value="9">october</option>
                  <option value="10">november</option>
                  <option value="11">december</option>
                </select>
                <select name="" id="year">
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                  <option value="2031">2031</option>
                  <option value="2032">2032</option>
                  <option value="2033">2033</option>
                  <option value="2034">2034</option>
                  <option value="2035">2035</option>
                </select>
                <button type="button" class="create" id="create">
                  <i class="fa fa-plus"></i> <span class="writing">new event</span>
                </button>
              </div>
            </div>
            <div class="days-week">
              <div>sun<span>day</span></div>
              <div>mon<span>day</span></div>
              <div>tue<span>day</span></div>
              <div>wed<span>day</span></div>
              <div>Thu<span>day</span></div>
              <div>Fri<span>day</span></div>
              <div>Sat<span>day</span></div>
            </div>
            <div class="days-month"></div>
            <div class="days-month-mobile"></div>
          </section>
  
          <section class="events-new-old">
            <div class="schedule-details">
              <h2>today events</h2>
              <p class="current-date">march 14, 2025</p>
            </div>
           
            

            <div class="holiday-display">
              <span class="color">|</span>
              <div class="text">
                <h2>Jamhuri day</h2>
                <p>celebrating the day kenya became a republic</p>
              </div>
            </div>

          <!--if no event exist then-->  

           <div style="display: none;" class="today-events">
            <div class="image">
              <img src="./teachers/images (54).jpeg" alt="">
            </div>
            <h3>there are no current events</h3>
           </div>
  
          <!--if an event exist then-->  

          <!--php to che k for todays events-->
          <h4 style="display:none;" class="today-day">thursday</h4>

          <?php
            include("connection.php");
            $today = "12/3/2025";

            $sqlCheck = "select * FROM events WHERE event_date = '$today'";
            $resultCheck = $conn->query($sqlCheck);
            $count_today = mysqli_num_rows($resultCheck);

            if($count_today > 0){
              $sqlGet = "select * FROM events WHERE event_date = '$today'";
              $resultGet = $conn->query($sqlGet);
              $row = $resultGet->fetch_assoc();
              echo "
                 <div class='other-events-container'>
                  <div class='other-event-box'>
                   <div class='date'>$row[event_date]</div>
                    <div class='text'>
                      <h4>$row[event_tittle]</h4>
                      <h5>12:00 - 14:00</h5>
                    </div>
                  </div>
              </div>";
            }else{
              echo "
               <div class='today-events'>
                  <div class='image'>
                    <img src='./teachers/images (54).jpeg' alt=''>
                  </div>
                  <h3>there are no current events</h3>
                </div>
              ";
            }
          ?>

      <input type="hidden" name="today-date" class="today-actual-date">

          <!--

          <div class="today-events exist">
            <h4 class="today-day">thursday</h4>
            <input type="hidden" name="today-date" class="today-actual-date">
            <ul>
              <li>
                <span></span>
                <h4>do math assignment</h4>
                <h5>educative</h5>
                <span class="icon"><i class="fa fa-trash-alt"></i></span>
              </li>
              <li>
                <span></span>
                <h4>do math assignment</h4>
                <h5>educative</h5>
                <span class="icon"><i class="fa fa-trash-alt"></i></span>
              </li>
              <li>
                <span></span>
                <h4>do math assignment</h4>
                <h5>educative</h5>
                <span class="icon"><i class="fa fa-trash-alt"></i></span>
              </li>
            </ul>
          </div>
          -->

          <div style="display: none;" class="all">
          <?php
            $sql = "select * FROM events ORDER BY event_date ASC";
            $result = $conn->query($sql);
            while($row = $result->fetch_assoc()){
              echo "
              <div class='date'>$row[event_date]</div>
              ";
           }
           ?>
          </div>  
          <!--other events goes in here-->
          <h2 class="other">other events</h2>

          <div class="other-events-container">
            <?php
            $sql = "select * FROM events ORDER BY event_date ASC";
            $result = $conn->query($sql);
            while($row = $result->fetch_assoc()){
              echo "
               <div class='other-event-box'>
                  <div class='date'>$row[event_date]</div>
                  <div class='text'>
                    <h4>$row[event_tittle]</h4>
                    <h5>$row[event_from] - $row[event_to]</h5>
                  </div>
            </div>
              ";
            } 
            ?>
            <div class="view-more-btn">
              <button type="button">view more</button>
            </div>

          </div>

          <!--other events ends here-->
          </section>
        </div>
      </div>
      <section class="modal-box" id="modal-box">
        <!--Create Event Modal Box-->
        <div class="create-event" id="create-event">
          <div class="head">
            <strong>Create new Event</strong>
          </div>
          <div class="body">
            <form method="post" action="eventsubmittion.php" class="centralise">
              <input
                type="text"
                name="event-tittle"
                id=""
                class="event-tittle"
                placeholder="event heading"
                required
              />
              <input
                type="text"
                name="event-date"
                id="event-date"
                class="event-tittle"
                required
              />
              <div class="from">
                <label for="from">from:
                <input type="time" name="from" id="from">
                </label>
                <label for="to">to:
                  <input type="time" name="to" id="to">
                </label>
                <label for="allday">allday: 
                  <i class="fa fa-toggle-on on-off"></i>
                  <input type="hidden" name="allday" id="allday">
                </label>
              </div>
              <select name="category" id="" class="category">
                <option value="">--choose category--</option>
                <option value="educative">educative</option>
                <option value="personal">personal</option>
                <option value="reminder">reminder</option>
              </select>
              <select name="destination" id="" class="destination">
                <option value="">--choose destination--</option>
                <option value="all">to all</option>
                <option value="students">students only</option>
                <option value="teachers">teachers only</option>
              </select>
              <textarea
                name="event-description"
                id=""
                placeholder="event description"
              ></textarea>
              <div class="btn">
                <button type="button" class="submit cancel">cancel</button>
                <button type="submit" class="submit">create</button>
              </div>
            </form>
          </div>
        </div>
        <!--Create Event Modal Box Ends Here-->

        <!--Check Events Modal box-->

        <div class="created-events" id="created-event">
          <div class="head">
            <strong>Today's events</strong>
          </div>
          <div class="body">
            <div class="centralise">
              <ul>
                <li>
                  <button type="button" class="sort">
                    <i class="fa fa-sort"></i>
                    <span class="writing">sort by</span>
                  </button>
                </li>
                <li>
                  <h3>My birthday</h3>
                  <p>march 10,2025</p>
                  <p class="category">personal</p>
                </li>
                <li>
                  <h3>My birthday</h3>
                  <p>march 10,2025</p>
                  <p class="category">personal</p>
                </li>
                <li>
                  <h3>My birthday</h3>
                  <p>march 10,2025</p>
                  <p class="category">personal</p>
                </li>
                <li>
                  <h3>My birthday</h3>
                  <p>march 10,2025</p>
                  <p class="category">personal</p>
                </li>
                <li>
                  <h3>My birthday</h3>
                  <p>march 10,2025</p>
                  <p class="category">personal</p>
                </li>
                <li>
                  <h3>My birthday</h3>
                  <p>march 10,2025</p>
                  <p class="category">personal</p>
                </li>
                <li>
                  <h3>My birthday</h3>
                  <p>march 10,2025</p>
                  <p class="category">personal</p>
                </li>
                <li>
                  <h3>My birthday</h3>
                  <p>march 10,2025</p>
                  <p class="category">personal</p>
                </li>
              </ul>
              <div class="btn">
                <button type="button" class="cancel">cancel</button>
                <button type="button" class="create">add</button>
              </div>
            </div>
          </div>
        </div>

        <!--Check Events Modal box ends Here-->
        
      </section>
     
    </main>
  </body>
</html>
